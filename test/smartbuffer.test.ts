import { SmartBuffer, SmartBufferOptions } from '../src/smartbuffer';
import { ERRORS, isFiniteInteger, checkEncoding, checkOffsetValue, checkLengthValue, checkTargetOffset } from '../src/utils';
import { assert } from 'chai';
import 'mocha';

describe('Constructing a SmartBuffer', () => {
  describe('Constructing with an existing Buffer', () => {
    const buff = new Buffer([0xaa, 0xbb, 0xcc, 0xdd, 0xff, 0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99]);
    const reader = SmartBuffer.fromBuffer(buff);

    it('should have the exact same internal Buffer when constructed with a Buffer', () => {
      assert.strictEqual(reader.internalBuffer, buff);
    });

    it('should return a buffer with the same content', () => {
      assert.deepEqual(reader.toBuffer(), buff);
    });
  });

  describe('Constructing with an existing Buffer and setting the encoding', () => {
    const buff = new Buffer([0xaa, 0xbb, 0xcc, 0xdd, 0xff, 0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99]);
    const reader = SmartBuffer.fromBuffer(buff, 'ascii');

    it('should have the exact same internal Buffer', () => {
      assert.strictEqual(reader.internalBuffer, buff);
    });

    it('should have the same encoding that was set', () => {
      assert.strictEqual(reader.encoding, 'ascii');
    });
  });

  describe('Constructing with a specified size', () => {
    const size = 128;
    const reader = SmartBuffer.fromSize(size);

    it('should have an internal Buffer with the same length as the size defined in the constructor', () => {
      assert.strictEqual(reader.internalBuffer.length, size);
    });
  });

  describe('Constructing with a specified encoding', () => {
    const encoding: BufferEncoding = 'utf8';

    it('should have an internal encoding with the encoding given to the constructor (1st argument)', () => {
      const reader = SmartBuffer.fromOptions({
        encoding
      });
      assert.strictEqual(reader.encoding, encoding);
    });

    it('should have an internal encoding with the encoding given to the constructor (2nd argument)', () => {
      const reader = SmartBuffer.fromSize(1024, encoding);
      assert.strictEqual(reader.encoding, encoding);
    });
  });

  describe('Constructing with SmartBufferOptions', () => {
    const validOptions1: SmartBufferOptions = {
      size: 1024,
      encoding: 'ascii'
    };

    const validOptions2: SmartBufferOptions = {
      buff: Buffer.alloc(1024)
    };

    const validOptions3: SmartBufferOptions = {
      encoding: 'utf8'
    };

    const invalidOptions1: any = {
      encoding: 'invalid'
    };

    const invalidOptions2: any = {
      size: -1
    };

    const invalidOptions3: any = {
      buff: 'notabuffer'
    };

    it('should create a SmartBuffer with size 1024 and ascii encoding', () => {
      const sbuff = SmartBuffer.fromOptions(validOptions1);
      assert.strictEqual(sbuff.encoding, validOptions1.encoding);
      assert.strictEqual(sbuff.internalBuffer.length, validOptions1.size);
    });

    it('should create a SmartBuffer with the provided buffer as the initial value', () => {
      const sbuff = SmartBuffer.fromOptions(validOptions2);
      assert.deepEqual(sbuff.internalBuffer, validOptions2.buff);
    });

    it('should create a SmartBuffer with the provided ascii encoding, and create a default buffer size', () => {
      const sbuff = SmartBuffer.fromOptions(validOptions3);
      assert.strictEqual(sbuff.encoding, validOptions3.encoding);
      assert.strictEqual(sbuff.internalBuffer.length, 4096);
    });

    it('should throw an error when given an options object with an invalid encoding', () => {
      assert.throws(() => {
        // tslint:disable-next-line:no-unused-variable
        const sbuff = SmartBuffer.fromOptions(invalidOptions1);
      });
    });

    it('should throw an error when given an options object with an invalid size', () => {
      assert.throws(() => {
        // tslint:disable-next-line:no-unused-variable
        const sbuff = SmartBuffer.fromOptions(invalidOptions2);
      });
    });

    it('should throw an error when given an options object with an invalid buffer', () => {
      assert.throws(() => {
        // tslint:disable-next-line:no-unused-variable
        const sbuff = SmartBuffer.fromOptions(invalidOptions3);
      });
    });
  });

  describe('Constructing with invalid parameters', () => {
    it('should throw an exception when given an object that is not a valid SmartBufferOptions object', () => {
      assert.throws(() => {
        const invalidOptions: object = {};
        const reader = SmartBuffer.fromOptions(invalidOptions);
      });
    });

    it('should throw an exception when given an invalid number size', () => {
      assert.throws(() => {
        // tslint:disable-next-line:no-unused-variable
        const reader = SmartBuffer.fromOptions({
          size: -100
        });
      }, Error);
    });

    it('should throw an exception when give a invalid encoding', () => {
      assert.throws(() => {
        const invalidEncoding: any = 'invalid';
        // tslint:disable-next-line:no-unused-variable
        const reader = SmartBuffer.fromOptions({
          encoding: invalidEncoding
        });
      }, Error);

      assert.throws(() => {
        const invalidEncoding: any = 'invalid';
        // tslint:disable-next-line:no-unused-variable
        const reader = SmartBuffer.fromSize(1024, invalidEncoding);
      }, Error);
    });

    it('should throw and exception when given an object that is not a SmartBufferOptions', () => {
      assert.throws(() => {
        // tslint:disable-next-line:no-unused-variable
        const reader = SmartBuffer.fromOptions(null);
      }, Error);
    });
  });

  describe('Constructing with factory methods', () => {
    const originalBuffer = new Buffer(10);

    const sbuff1 = SmartBuffer.fromBuffer(originalBuffer);

    it('Should create a SmartBuffer with a provided internal Buffer as the initial value', () => {
      assert.deepEqual(sbuff1.internalBuffer, originalBuffer);
    });

    const sbuff2 = SmartBuffer.fromSize(1024);

    it('Should create a SmartBuffer with a set provided initial Buffer size', () => {
      assert.strictEqual(sbuff2.internalBuffer.length, 1024);
    });

    const options: any = {
      size: 1024,
      encoding: 'ascii'
    };

    const sbuff3 = SmartBuffer.fromOptions(options);

    it('Should create a SmartBuffer instance with a given SmartBufferOptions object', () => {
      assert.strictEqual(sbuff3.encoding, options.encoding);
      assert.strictEqual(sbuff3.internalBuffer.length, options.size);
    });
  });
});

describe('Reading/Writing To/From SmartBuffer', () => {
  /**
     * Technically, if one of these works, they all should. But they're all here anyways.
     */
  describe('Numeric Values', () => {
    let reader = new SmartBuffer();
    reader.writeInt8(0x44);
    reader.writeUInt8(0xff);
    reader.writeInt16BE(0x6699);
    reader.writeInt16LE(0x6699);
    reader.writeUInt16BE(0xffdd);
    reader.writeUInt16LE(0xffdd);
    reader.writeInt32BE(0x77889900);
    reader.writeInt32LE(0x77889900);
    reader.writeUInt32BE(0xffddccbb);
    reader.writeUInt32LE(0xffddccbb);
    reader.writeFloatBE(1.234);
    reader.writeFloatLE(1.234);
    reader.writeDoubleBE(1.23456789);
    reader.writeDoubleLE(1.23456789);
    reader.writeUInt8(0xc8, 0);
    reader.writeUInt16LE(0xc8, 4);
    reader.insertUInt16LE(0x6699, 6);
    reader.writeUInt16BE(0x6699);
    reader.insertUInt16BE(0x6699, reader.length - 1);

    let iReader = new SmartBuffer();

    iReader.insertInt8(0x44, 0);
    iReader.insertUInt8(0x44, 0);
    iReader.insertInt16BE(0x6699, 0);
    iReader.insertInt16LE(0x6699, 0);
    iReader.insertUInt16BE(0x6699, 0);
    iReader.insertUInt16LE(0x6699, 0);
    iReader.insertInt32BE(0x6699, 0);
    iReader.insertInt32LE(0x6699, 0);
    iReader.insertUInt32BE(0x6699, 0);
    iReader.insertUInt32LE(0x6699, 0);
    iReader.insertFloatBE(0x6699, 0);
    iReader.insertFloatLE(0x6699, 0);
    iReader.insertDoubleBE(0x6699, 0);
    iReader.insertDoubleLE(0x6699, 0);
    iReader.writeStringNT('h', 2);
    iReader.insertBuffer(new Buffer('he'), 2);
    iReader.insertBufferNT(new Buffer('he'), 2);
    iReader.readInt8(0);

    it('should equal the correct values that were written above', () => {
      assert.strictEqual(reader.readUInt8(), 0xc8);
      assert.strictEqual(reader.readUInt8(), 0xff);
      assert.strictEqual(reader.readInt16BE(), 0x6699);
      assert.strictEqual(reader.readInt16LE(), 0xc8);
      assert.strictEqual(reader.readInt16LE(), 0x6699);
      assert.strictEqual(reader.readUInt16BE(), 0xffdd);
      assert.strictEqual(reader.readUInt16LE(), 0xffdd);
      assert.strictEqual(reader.readInt32BE(), 0x77889900);
      assert.strictEqual(reader.readInt32LE(), 0x77889900);
      assert.strictEqual(reader.readUInt32BE(), 0xffddccbb);
      assert.strictEqual(reader.readUInt32LE(), 0xffddccbb);
      assert.closeTo(reader.readFloatBE(), 1.234, 0.001);
      assert.closeTo(reader.readFloatLE(), 1.234, 0.001);
      assert.closeTo(reader.readDoubleBE(), 1.23456789, 0.001);
      assert.closeTo(reader.readDoubleLE(), 1.23456789, 0.001);
      assert.equal(reader.readUInt8(0), 0xc8);
    });

    it('should throw an exception if attempting to read numeric values from a buffer with not enough data left', () => {
      assert.throws(() => {
        reader.readUInt32BE();
      });
    });

    it('should throw an exception if attempting to write numeric values to a negative offset.', () => {
      assert.throws(() => {
        reader.writeUInt16BE(20, -5);
      });
    });
  });


  describe('BigInt values', () => {
    describe('When BigInt is available and so are Buffer methods', () => {
      before(function() {
        if (typeof BigInt === 'undefined' ||
            typeof Buffer.prototype.writeBigInt64BE === 'undefined') {
            this.skip();
        }
      });

      it('Reading written-to buffer should read back the results of the insert', () => {
        const wBuffer = new SmartBuffer();
        wBuffer.writeBigInt64LE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));
        wBuffer.writeBigInt64BE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(3));
        wBuffer.writeBigUInt64LE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(4));
        wBuffer.writeBigUInt64BE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(5));

        assert.equal(wBuffer.readBigInt64LE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2));
        assert.equal(wBuffer.readBigInt64BE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(3));
        assert.equal(wBuffer.readBigUInt64LE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(4));
        assert.equal(wBuffer.readBigUInt64BE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(5));
      });

      it('Reading inserted-into buffer should read back the results of the insert', () => {
        const iBuffer = new SmartBuffer();
        iBuffer.insertBigInt64LE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(6), 0);
        iBuffer.insertBigInt64BE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(7), 0);
        iBuffer.insertBigUInt64LE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(8), 0);
        iBuffer.insertBigUInt64BE(BigInt(Number.MAX_SAFE_INTEGER) * BigInt(9), 0);

        assert.equal(iBuffer.readBigInt64BE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(9));
        assert.equal(iBuffer.readBigInt64LE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(8));
        assert.equal(iBuffer.readBigUInt64BE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(7));
        assert.equal(iBuffer.readBigUInt64LE(), BigInt(Number.MAX_SAFE_INTEGER) * BigInt(6));
      });
    });

    describe('When BigInt is available but buffer methods are not', () => {
      beforeEach(function () {
        if (typeof BigInt === 'undefined' ||
            typeof Buffer.prototype.readBigInt64BE === 'function') {
            this.skip();
        }
      });
      const buffer = new SmartBuffer();

      // Taking a Number to a BigInt as we do below is semantically invalid,
      // and implicit casting between Number and BigInt throws a TypeError in
      // JavaScript. However here, these methods immediately throw the platform
      // exception, and no cast really takes place. These casts are solely to
      // satisfy the type checker, as BigInt doesn't exist at runtime in these tests

      it('Writing throws an exception', () => {
        assert.throws(() => buffer.writeBigInt64LE(1 as any as bigint), 'Platform does not support Buffer.prototype.writeBigInt64LE.');
        assert.throws(() => buffer.writeBigInt64BE(2 as any as bigint), 'Platform does not support Buffer.prototype.writeBigInt64BE.');
        assert.throws(() => buffer.writeBigUInt64LE(1 as any as bigint), 'Platform does not support Buffer.prototype.writeBigUInt64LE.');
        assert.throws(() => buffer.writeBigUInt64BE(2 as any as bigint), 'Platform does not support Buffer.prototype.writeBigUInt64BE.');
      });

      it('Inserting throws an exception', () => {
        assert.throws(
          () => buffer.insertBigInt64LE(1 as any as bigint, 0), 'Platform does not support Buffer.prototype.writeBigInt64LE.');
        assert.throws(
          () => buffer.insertBigInt64BE(2 as any as bigint, 0), 'Platform does not support Buffer.prototype.writeBigInt64BE.');
        assert.throws(
          () => buffer.insertBigUInt64LE(1 as any as bigint, 0), 'Platform does not support Buffer.prototype.writeBigUInt64LE.');
        assert.throws(
          () => buffer.insertBigUInt64BE(2 as any as bigint, 0), 'Platform does not support Buffer.prototype.writeBigUInt64BE.');
      });

      it('Reading throws an exception', () => {
        assert.throws(() => buffer.readBigInt64LE(), 'Platform does not support Buffer.prototype.readBigInt64LE.');
        assert.throws(() => buffer.readBigInt64BE(), 'Platform does not support Buffer.prototype.readBigInt64BE.');
        assert.throws(() => buffer.readBigUInt64LE(), 'Platform does not support Buffer.prototype.readBigUInt64LE.');
        assert.throws(() => buffer.readBigUInt64BE(), 'Platform does not support Buffer.prototype.readBigUInt64BE.');
      });
    });

    describe('When BigInt is unavailable', () => {
      beforeEach(function () {
        if (typeof BigInt === 'function') {
            this.skip();
        }
      });
      const buffer = new SmartBuffer();

      // Taking a Number to a BigInt as we do below is semantically invalid,
      // and implicit casting between Number and BigInt throws a TypeError in
      // JavaScript. However here, these methods immediately throw the platform
      // exception, and no cast really takes place. These casts are solely to
      // satisfy the type checker, as BigInt doesn't exist at runtime in these tests

      it('Writing throws an exception', () => {
        assert.throws(() => buffer.writeBigInt64LE(1 as any as bigint), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.writeBigInt64BE(2 as any as bigint), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.writeBigUInt64LE(1 as any as bigint), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.writeBigUInt64BE(2 as any as bigint), 'Platform does not support JS BigInt type.');
      });

      it('Inserting throws an exception', () => {
        assert.throws(() => buffer.insertBigInt64LE(1 as any as bigint, 0), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.insertBigInt64BE(2 as any as bigint, 0), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.insertBigUInt64LE(1 as any as bigint, 0), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.insertBigUInt64BE(2 as any as bigint, 0), 'Platform does not support JS BigInt type.');
      });

      it('Reading throws an exception', () => {
        assert.throws(() => buffer.readBigInt64LE(), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.readBigInt64BE(), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.readBigUInt64LE(), 'Platform does not support JS BigInt type.');
        assert.throws(() => buffer.readBigUInt64BE(), 'Platform does not support JS BigInt type.');
      });
    });
  });

  describe('Basic String Values', () => {
    let reader = new SmartBuffer();
    reader.writeStringNT('hello');
    reader.writeString('world');
    reader.writeStringNT('✎✏✎✏✎✏');
    reader.insertStringNT('first', 0);
    reader.writeString('hello', 'ascii');
    reader.writeString('hello');

    it('should equal the correct strings that were written prior', () => {
      assert.strictEqual(reader.readStringNT(), 'first');
      assert.strictEqual(reader.readStringNT(), 'hello');
      assert.strictEqual(reader.readString(5), 'world');
      assert.strictEqual(reader.readStringNT(), '✎✏✎✏✎✏');
      assert.strictEqual(reader.readString(5, 'ascii'), 'hello');
    });

    it('should throw an exception if passing in an invalid string length to read (infinite)', () => {
      assert.throws(() => {
        reader.readString(NaN);
      });
    });

    it('should throw an exception if passing in an invalid string length to read (negative)', () => {
      assert.throws(() => {
        reader.readString(-5);
      });
    });

    it('should throw an exception if passing in an invalid string offset to insert (non number)', () => {
      assert.throws(() => {
        const invalidNumber: any = 'sdfdf';
        reader.insertString('hello', invalidNumber);
      });
    });
  });

  describe('Mixed Encoding Strings', () => {
    let reader = SmartBuffer.fromOptions({
      encoding: 'ascii'
    });
    reader.writeStringNT('some ascii text');
    reader.writeStringNT('ѕσмє υтƒ8 тєχт', 'utf8');
    reader.insertStringNT('first', 0, 'ascii');

    it('should equal the correct strings that were written above', () => {
      assert.strictEqual(reader.readStringNT(), 'first');
      assert.strictEqual(reader.readStringNT(), 'some ascii text');
      assert.strictEqual(reader.readStringNT('utf8'), 'ѕσмє υтƒ8 тєχт');
    });

    it('should throw an error when an invalid encoding is provided', () => {
      assert.throws(() => {
        // tslint:disable-next-line
        const invalidBufferType: any = 'invalid';
        reader.writeString('hello', invalidBufferType);
      });
    });

    it('should throw an error when an invalid encoding is provided along with a valid offset', () => {
      assert.throws(() => {
        const invalidBufferType: any = 'invalid';
        reader.writeString('hellothere', 2, invalidBufferType);
      });
    });
  });

  describe('Null/non-null terminating strings', () => {
    let reader = new SmartBuffer();
    reader.writeString('hello\0test\0bleh');

    it('should equal hello', () => {
      assert.strictEqual(reader.readStringNT(), 'hello');
    });

    it('should equal: test', () => {
      assert.strictEqual(reader.readString(4), 'test');
    });

    it('should have a length of zero', () => {
      assert.strictEqual(reader.readStringNT().length, 0);
    });

    it('should return an empty string', () => {
      assert.strictEqual(reader.readString(0), '');
    });

    it('should equal: bleh', () => {
      assert.strictEqual(reader.readStringNT(), 'bleh');
    });
  });

  describe('Reading string without specifying length', () => {
    let str = 'hello123';
    let writer = new SmartBuffer();
    writer.writeString(str);

    let reader = SmartBuffer.fromBuffer(writer.toBuffer());

    assert.strictEqual(reader.readString(), str);
  });

  describe('Write string as specific position', () => {
    let str = 'hello123';
    let writer = new SmartBuffer();
    writer.writeString(str, 10);

    let reader = SmartBuffer.fromBuffer(writer.toBuffer());

    reader.readOffset = 10;
    it('Should read the correct string from the original position it was written to.', () => {
      assert.strictEqual(reader.readString(), str);
    });
  });

  describe('Buffer Values', () => {
    describe('Writing buffer to position 0', () => {
      let buff = new SmartBuffer();
      let frontBuff = new Buffer([1, 2, 3, 4, 5, 6]);
      buff.writeStringNT('hello');
      buff.writeBuffer(frontBuff, 0);

      it('should write the buffer to the front of the smart buffer instance', () => {
        let readBuff = buff.readBuffer(frontBuff.length);
        assert.deepEqual(readBuff, frontBuff);
      });
    });

    describe('Writing null terminated buffer to position 0', () => {
      let buff = new SmartBuffer();
      let frontBuff = new Buffer([1, 2, 3, 4, 5, 6]);
      buff.writeStringNT('hello');
      buff.writeBufferNT(frontBuff, 0);

      it('should write the buffer to the front of the smart buffer instance', () => {
        let readBuff = buff.readBufferNT();
        assert.deepEqual(readBuff, frontBuff);
      });
    });

    describe('Explicit lengths', () => {
      let buff = new Buffer([0x01, 0x02, 0x04, 0x08, 0x16, 0x32, 0x64]);
      let reader = new SmartBuffer();
      reader.writeBuffer(buff);

      it('should equal the buffer that was written above.', () => {
        assert.deepEqual(reader.readBuffer(7), buff);
      });
    });

    describe('Implicit lengths', () => {
      let buff = new Buffer([0x01, 0x02, 0x04, 0x08, 0x16, 0x32, 0x64]);
      let reader = new SmartBuffer();
      reader.writeBuffer(buff);

      it('should equal the buffer that was written above.', () => {
        assert.deepEqual(reader.readBuffer(), buff);
      });
    });

    describe('Null Terminated Buffer Reading', () => {
      let buff = new SmartBuffer();
      buff.writeBuffer(new Buffer([0x01, 0x02, 0x03, 0x04, 0x00, 0x01, 0x02, 0x03]));

      let read1 = buff.readBufferNT();
      let read2 = buff.readBufferNT();

      it('Should return a length of 4 for the four bytes before the first null in the buffer.', () => {
        assert.equal(read1.length, 4);
      });

      it('Should return a length of 3 for the three bytes after the first null in the buffer after reading to end.', () => {
        assert.equal(read2.length, 3);
      });
    });

    describe('Null Terminated Buffer Writing', () => {
      let buff = new SmartBuffer();
      buff.writeBufferNT(new Buffer([0x01, 0x02, 0x03, 0x04]));

      let read1 = buff.readBufferNT();

      it('Should read the correct null terminated buffer data.', () => {
        assert.equal(read1.length, 4);
      });
    });

    describe('Reading buffer from invalid offset', () => {
      let buff = new SmartBuffer();
      buff.writeBuffer(Buffer.from([1, 2, 3, 4, 5, 6]));

      it('Should throw an exception if attempting to read a Buffer from an invalid offset', () => {
        assert.throws(() => {
          const invalidOffset: any = 'sfsdf';
          buff.readBuffer(invalidOffset);
        });
      });
    });

    describe('Inserting values into specific positions', () => {
      let reader = new SmartBuffer();

      reader.writeUInt16LE(0x0060);
      reader.writeStringNT('something');
      reader.writeUInt32LE(8485934);
      reader.writeUInt16LE(6699);
      reader.writeStringNT('else');
      reader.insertUInt16LE(reader.length - 2, 2);

      it('should equal the size of the remaining data in the buffer', () => {
        reader.readUInt16LE();
        let size = reader.readUInt16LE();
        assert.strictEqual(reader.remaining(), size);
      });
    });

    describe('Adding more data to the buffer than the internal buffer currently allows.', () => {
      it('Should automatically adjust internal buffer size when needed', () => {
        let writer = new SmartBuffer();
        let largeBuff = new Buffer(10000);

        writer.writeBuffer(largeBuff);

        assert.strictEqual(writer.length, largeBuff.length);
      });
    });
  });
});

describe('Skipping around data', () => {
  let writer = new SmartBuffer();
  writer.writeStringNT('hello');
  writer.writeUInt16LE(6699);
  writer.writeStringNT('world!');

  it('Should equal the UInt16 that was written above', () => {
    let reader = SmartBuffer.fromBuffer(writer.toBuffer());
    reader.readOffset += 6;
    assert.strictEqual(reader.readUInt16LE(), 6699);
    reader.readOffset = 0;
    assert.strictEqual(reader.readStringNT(), 'hello');
    reader.readOffset -= 6;
    assert.strictEqual(reader.readStringNT(), 'hello');
  });

  it('Should throw an error when attempting to skip more bytes than actually exist.', () => {
    let reader = SmartBuffer.fromBuffer(writer.toBuffer());

    assert.throws(() => {
      reader.readOffset = 10000;
    });
  });
});

describe('Setting write and read offsets', () => {
  const writer = SmartBuffer.fromSize(100);
  writer.writeString('hellotheremynameisjosh');

  it('should set the write offset to 10', () => {
    writer.writeOffset = 10;
    assert.strictEqual(writer.writeOffset, 10);
  });

  it('should set the read offset to 10', () => {
    writer.readOffset = 10;
    assert.strictEqual(writer.readOffset, 10);
  });

  it('should throw an error when given an offset that is out of bounds', () => {
    assert.throws(() => {
      writer.readOffset = -1;
    });
  });

  it('should throw an error when given an offset that is out of bounds', () => {
    assert.throws(() => {
      writer.writeOffset = 1000;
    });
  });
});

describe('Setting encoding', () => {
  const writer = SmartBuffer.fromSize(100);
  it('should have utf8 encoding by default', () => {
    assert.strictEqual(writer.encoding, 'utf8');
  });

  it('should have ascii encoding after being set', () => {
    writer.encoding = 'ascii';
    assert.strictEqual(writer.encoding, 'ascii');
  });
});

describe('Automatic internal buffer resizing', () => {
  let writer = new SmartBuffer();

  it('Should not throw an error when adding data that is larger than current buffer size (internal resize algo fails)', () => {
    let str = 'String larger than one byte';
    writer = SmartBuffer.fromSize(1);
    writer.writeString(str);

    assert.strictEqual(writer.internalBuffer.length, str.length);
  });

  it('Should not throw an error when adding data that is larger than current buffer size (internal resize algo succeeds)', () => {
    writer = SmartBuffer.fromSize(100);
    let buff = new Buffer(105);

    writer.writeBuffer(buff);

    // Test internal array growth algo.
    assert.strictEqual(writer.internalBuffer.length, 100 * 3 / 2 + 1);
  });
});

describe('Clearing the buffer', () => {
  let writer = new SmartBuffer();
  writer.writeString('somedata');

  it('Should contain some data.', () => {
    assert.notStrictEqual(writer.length, 0);
  });

  it('Should contain zero data after being cleared.', () => {
    writer.clear();
    assert.strictEqual(writer.length, 0);
  });
});

describe('Displaying the buffer as a string', () => {
  let buff = new Buffer([1, 2, 3, 4]);
  let sbuff = SmartBuffer.fromBuffer(buff);

  let str = buff.toString();
  let str64 = buff.toString('binary');

  it('Should return a valid string representing the internal buffer', () => {
    assert.strictEqual(str, sbuff.toString());
  });

  it('Should return a valid base64 string representing the internal buffer', () => {
    assert.strictEqual(str64, sbuff.toString('binary'));
  });

  it('Should throw an error if an invalid encoding is provided', () => {
    assert.throws(() => {
      const invalidencoding: any = 'invalid';
      let strError = sbuff.toString(invalidencoding);
    });
  });
});

describe('Destroying the buffer', () => {
  let writer = new SmartBuffer();
  writer.writeString('hello123');

  writer.destroy();

  it('Should have a length of zero when buffer is destroyed', () => {
    assert.strictEqual(0, writer.length);
  });
});

describe('ensureWritable()', () => {
  let sbuff: any = SmartBuffer.fromSize(10);

  it('should increase the internal buffer size to accomodate given size.', () => {
    sbuff._ensureWriteable(100);

    assert.strictEqual(sbuff.internalBuffer.length >= 100, true);
  });
});

describe('isSmartBufferOptions()', () => {
  it('should return true when encoding is defined', () => {
    assert.strictEqual(
      SmartBuffer.isSmartBufferOptions({
        encoding: 'utf8'
      }),
      true
    );
  });

  it('should return true when size is defined', () => {
    assert.strictEqual(
      SmartBuffer.isSmartBufferOptions({
        size: 1024
      }),
      true
    );
  });

  it('should return true when buff is defined', () => {
    assert.strictEqual(
      SmartBuffer.isSmartBufferOptions({
        buff: Buffer.alloc(4096)
      }),
      true
    );
  });
});

describe('utils', () => {
  describe('isFiniteInteger', () => {
    it('should return true for a number that is finite and an integer', () => {
      assert.equal(isFiniteInteger(10), true);
    });

    it('should return false for a number that is infinite', () => {
      assert.equal(isFiniteInteger(NaN), false);
    });

    it('should return false for a number that is not an integer', () => {
      assert.equal(isFiniteInteger(10.1), false);
    });
  });

  describe('checkEncoding', () => {
    it('should throw an exception if a given string is not a valid BufferEncoding', () => {
      assert.throws(() => {
        const invalidEncoding: any = 'sdfdf';
        checkEncoding(invalidEncoding);
      });
    });
  });
});
