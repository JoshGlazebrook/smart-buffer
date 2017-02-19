/// <reference types="node" />
/**
 * Object interface for constructing new SmartBuffer instances.
 */
interface SmartBufferOptions {
    encoding?: BufferEncoding;
    size?: number;
    buff?: Buffer;
}

declare class SmartBuffer {
    length: number;
    encoding: BufferEncoding;
    private buff;
    private writeOffset;
    private readOffset;

    /**
     * Creates a new SmartBuffer instance with the provided internal Buffer size and optional encoding.
     *
     * @param size { Number } The size of the internal Buffer.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */
    static fromSize(size: number, encoding?: BufferEncoding): SmartBuffer;
    /**
     * Creates a new SmartBuffer instance with the provided Buffer and optional encoding.
     *
     * @param buffer { Buffer } The Buffer to use as the internal Buffer value.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */
    static fromBuffer(buff: Buffer, encoding?: BufferEncoding): SmartBuffer;
    /**
     * Creates a new SmartBuffer instance with the provided SmartBufferOptions options.
     * 
     * @param options { SmartBufferOptions } The options to use when creating the SmartBuffer instance.
     */
    static fromOptions(options: SmartBufferOptions): SmartBuffer
    /**
     * Type checking function that determines if an object is a SmartBufferOptions object.
     */
    static isSmartBufferOptions(options: SmartBufferOptions): options is SmartBufferOptions;

    /**
     * Creates a new SmartBuffer instance (defaults to utf8 encoding, 4096 internal Buffer size)
     */
    constructor();

    /**
     * Creates a new SmartBuffer instance
     *
     * @param size { Number } The size the underlying buffer instance should be instantiated to (defaults to 4096)
     * @param encoding { BufferEncoding } The string encoding to use for reading/writing strings (defaults to utf8)
     * 
     * @deprecated The .fromXXX() factory methods are now preferred over the new instantiator method.
     */
    constructor(size: number, encoding?: BufferEncoding);

    /**
     * Creates a new SmartBuffer instance
     *
     * @param encoding { BufferEncoding } The string encoding to use for reading/writing strings (defaults to utf8)
     * 
     * @deprecated The .fromXXX() factory methods are now preferred over the new instantiator method.
     */
    constructor(encoding?: BufferEncoding);

    /**
     * Creates a new SmartBuffer instance
     *
     * @param buff { Buffer } An existing buffer instance to copy to this smart buffer instance
     * @param encoding { BufferEncoding } The string encoding to use for reading/writing strings (defaults to utf8)
     * 
     * @deprecated The .fromXXX() factory methods are now preferred over the new instantiator method.
     */
    constructor(buff: Buffer, encoding?: string);

    /**
     * Creates a new SmartBuffer instance
     * 
     * @param options { SmartBufferOptions } The SmartBufferOptions settings to use when creating the SmartBuffer instance.
     * 
     */
    constructor(options: SmartBufferOptions);

    /**
     * Writes a numeric number value using the provided function.
     *
     * @param func { Function(offset: number, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { Number } The number value to write.
     * @param offset { Number } the offset to write the number at.
     *
     */
    private writeNumberValue(func, byteSize, value, offset?);
    /**
     * Reads an Int8 value from the current read position.
     *
     * @return { Number }
     */
    readInt8(): number;
    /**
     * Reads an Int16BE value from the current read position.
     *
     * @return { Number }
     */
    readInt16BE(): number;
    /**
     * Reads an Int16LE value from the current read position.
     *
     * @return { Number }
     */
    readInt16LE(): number;
    /**
     * Reads an Int32BE value from the current read position.
     *
     * @return { Number }
     */
    readInt32BE(): number;
    /**
     * Reads an Int32LE value from the current read position.
     *
     * @return { Number }
     */
    readInt32LE(): number;
    /**
     * Writes an Int8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt8(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an Int16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt16BE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an Int16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt16LE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an Int32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt32BE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an Int32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt32LE(value: number, offset?: number): SmartBuffer;
    /**
     * Reads an UInt8 value from the current read position.
     *
     * @return { Number }
     */
    readUInt8(): number;
    /**
     * Reads an UInt16BE value from the current read position.
     *
     * @return { Number }
     */
    readUInt16BE(): number;
    /**
     * Reads an UInt16LE value from the current read position.
     *
     * @return { Number }
     */
    readUInt16LE(): number;
    /**
     * Reads an UInt32BE value from the current read position.
     *
     * @return { Number }
     */
    readUInt32BE(): number;
    /**
     * Reads an UInt32LE value from the current read position.
     *
     * @return { Number }
     */
    readUInt32LE(): number;
    /**
     * Writes an UInt8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt8(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an UInt16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt16BE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an UInt16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt16LE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an UInt32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt32BE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes an UInt32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt32LE(value: number, offset?: number): SmartBuffer;
    /**
     * Reads an FloatBE value from the current read position.
     *
     * @return { Number }
     */
    readFloatBE(): number;
    /**
     * Reads an FloatLE value from the current read position.
     *
     * @return { Number }
     */
    readFloatLE(): number;
    /**
     * Writes a FloatBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeFloatBE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes a FloatLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeFloatLE(value: number, offset?: number): SmartBuffer;
    /**
     * Reads an DoublEBE value from the current read position.
     *
     * @return { Number }
     */
    readDoubleBE(): number;
    /**
     * Reads an DoubleLE value from the current read position.
     *
     * @return { Number }
     */
    readDoubleLE(): number;
    /**
     * Writes a DoubleBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeDoubleBE(value: number, offset?: number): SmartBuffer;
    /**
     * Writes a DoubleLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeDoubleLE(value: number, offset?: number): SmartBuffer;
    /**
     * Reads a String from the current read position.
     *
     * @param length { Number } The number of bytes to read as a String.
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */
    readString(length?: number, encoding?: BufferEncoding): string;
    /**
     * Writes a String to the current write position.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     */
    writeString(value: string, arg2?: number | BufferEncoding, encoding?: BufferEncoding): this;
    /**
     * Reads a null-terminated String from the current read position.
     *
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */
    readStringNT(encoding?: BufferEncoding): string;
    /**
     * Writes a null-terminated String to the current write position.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     */
    writeStringNT(value: string, offset?: number | BufferEncoding, encoding?: BufferEncoding): void;
    /**
     * Reads a Buffer from the internal read position.
     *
     * @param length { Number } The length of data to read as a Buffer.
     *
     * @return { Buffer }
     */
    readBuffer(length?: number): Buffer;
    /**
     * Writes a Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     */
    writeBuffer(value: Buffer, offset?: number): this;
    /**
     * Reads a null-terminated Buffer from the current read poisiton.
     *
     * @return { Buffer }
     */
    readBufferNT(): Buffer;
    /**
     * Writes a null-terminated Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     */
    writeBufferNT(value: Buffer, offset?: number): this;
    /**
     * Clears the SmartBuffer instance to its original empty state.
     */
    clear(): void;
    /**
     * Gets the remaining data left to be read from the SmartBuffer instance.
     *
     * @return { Number }
     */
    remaining(): number;
    /**
     * Moves the read offset forward.
     *
     * @param amount { Number } The amount to move the read offset forward by.
     */
    skip(amount: number): void;
    /**
     * Moves the read offset backwards.
     *
     * @param amount { Number } The amount to move the read offset backwards by.
     */
    rewind(amount: number): void;
    /**
     * Moves the read offset to a specific position.
     *
     * @param position { Number } The position to move the read offset to.
     */
    skipTo(position: number): void;
    /**
     * Moves the read offset to a specific position.
     *
     * @param position { Number } The position to move the read offset to.
     */
    moveTo(position: number): void;
    /**
     * Gets the value of the internal managed Buffer
     *
     * @param { Buffer }
     */
    toBuffer(): Buffer;
    /**
     * Gets the String value of the internal managed Buffer
     *
     * @param encoding { String } The BufferEncoding to display the Buffer as (defaults to instance level encoding).
     */
    toString(encoding?: BufferEncoding): string;
    /**
     * Destroys the SmartBuffer instance.
     */
    destroy(): void;
    /**
     * Ensures that the internal Buffer is large enough to read data.
     *
     * @param length { Number } The length of the data that needs to be read.
     */
    private ensureReadable(length: number);
    /**
     * Ensures that the internal Buffer is large enough to write data.
     * 
     * @param minLength { Number } The minimum length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written.
     */
    private ensureWriteable(minLength: number, offset?: number);
    /**
     * Ensures that the internal Buffer is large enough to write at least the given amount of data.
     *
     * @param minLength { Number } The minimum length of the data needs to be written.
     */
    private ensureCapacity(minLength: number);
    /**
     * Reads a numeric number value using the provided function.
     *
     * @param func { Function(offset: number) => number } The function to read data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes read.
     *
     * @param { Number }
     */
    private readNumberValue(func: (offset: number) => number, byteSize: number);
}

export {
    SmartBufferOptions,
    SmartBuffer
};