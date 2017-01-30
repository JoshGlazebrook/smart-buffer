# Change Log

## 2.0
> Relased 01/30/2017

### New Features:

* Entire package re-written in TypeScript (2.1)
* Backwards compatibility is preserved for now
* New factory methods for creating SmartBuffer instances
    * SmartBuffer.fromSize()
    * SmartBuffer.fromBuffer()
    * SmartBuffer.fromOptions()
* New SmartBufferOptions constructor options
* Added additional tests

### Bug Fixes:
* Fixes a bug where reading null terminated strings may result in an exception.