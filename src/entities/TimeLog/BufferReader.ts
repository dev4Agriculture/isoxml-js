// A modified version of https://github.com/villadora/node-buffer-reader

function BufferReader(buffer) {
    buffer = buffer || new ArrayBuffer(0);
    this.buf = buffer;
    this.view = new DataView(this.buf);
    this.offset = 0;
}

BufferReader.prototype.tell = function() {
    return this.offset;
};

BufferReader.prototype.seek = function(pos) {
    this.offset = pos;
    return this;
};

BufferReader.prototype.move = function(diff) {
    this.offset += diff;
    return this;
};

function MAKE_NEXT_READER(valueName, size) {
    BufferReader.prototype['next' + valueName] = function() {
        var val = this.view['get' + valueName](this.offset, true);
        this.offset += size;
        return val
    };
}

function MAKE_NEXT_READER_BOTH(valueName, size) {
    MAKE_NEXT_READER(valueName, size);
}

MAKE_NEXT_READER('Int8', 1);
MAKE_NEXT_READER('Uint8', 1);
MAKE_NEXT_READER_BOTH('Uint16', 2);
MAKE_NEXT_READER_BOTH('Int16', 2);
MAKE_NEXT_READER_BOTH('Uint32', 4);
MAKE_NEXT_READER_BOTH('Int32', 4);
MAKE_NEXT_READER_BOTH('Float', 4);
MAKE_NEXT_READER_BOTH('Double', 8);

export default BufferReader;