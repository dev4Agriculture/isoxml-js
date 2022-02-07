// A modified version of https://github.com/villadora/node-buffer-reader

const types = {
    'Int8': 1,
    'Uint8': 1,
    'Int16': 2,
    'Uint16': 2,
    'Int32': 4,
    'Uint32': 4,
    'Float': 4,
    'Double': 8,
}

type BufferReaderInterface = {
    [t in keyof typeof types as `next${t}`]: () => number
} & {
    tell: () => number
    seek: (pos: number) => void
    move: (diff: number) => void
}

type BufferReaderConstructor = { new (buffer: ArrayBuffer): BufferReaderInterface }

const BufferReader = function (buffer: ArrayBuffer) {
    buffer = buffer || new ArrayBuffer(0)
    this.buf = buffer
    this.view = new DataView(this.buf)
    this.offset = 0
} as any as BufferReaderConstructor

BufferReader.prototype.tell = function() {
    return this.offset
}

BufferReader.prototype.seek = function(pos) {
    this.offset = pos
}

BufferReader.prototype.move = function(diff) {
    this.offset += diff
}

function MAKE_NEXT_READER(valueName, size) {
    BufferReader.prototype['next' + valueName] = function() {
        const val = this.view['get' + valueName](this.offset, true)
        this.offset += size
        return val
    }
}

Object.keys(types).forEach(type => {
    MAKE_NEXT_READER(type, types[type])
})

export default BufferReader