# Change Log
## 3.0.3
> Released 02/19/2017
* Adds missing type definitions for some internal functions.

## 3.0.2
> Released 02/17/2017

### Bug Fixes
* Fixes a bug where using readString with a length of zero resulted in reading the remaining data instead of returning an empty string. (Fixed by Seldszar)

## 3.0.1
> Released 02/15/2017

### Bug Fixes
* Fixes a bug leftover from the TypeScript refactor where .readIntXXX() resulted in .readUIntXXX() being called by mistake.

## 3.0
> Released 02/12/2017

### Bug Fixes
* readUIntXXXX() methods will now throw an exception if they attempt to read beyond the bounds of the valid buffer data available.
    * **Note** This is technically a breaking change, so version is bumped to 3.x. 

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
