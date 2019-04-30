class DataView {
    constructor(data, from, to) {
        this._data = data
        this._from = from
        this._to = to
    }

    at(idx) {
        return this._data[this._from + idx]
    }

    get length() {
        return this._to - this._from
    }
}


class Model {
    constructor(provider) {
        this._provider = provider
        this._data = []
        this._pollInterval = 50
        this._intervalHandle = null
    }

    feed() {
        this._intervalHandle = setInterval(() => {
            this._data.push(this._provider.poll())
        }, this._pollInterval)
    }

    setDataForTesting(values) {
        this._data = values
    }

    findLeft(timestamp) {
        var start = 0
        var end = this._data.length
        var idx;
        while (start < end) {
            idx = Math.floor((start + end) / 2)
            if (this._data[idx].timestamp < timestamp) {
                start = idx + 1
            } else {
                end = idx
            }
        }
        if (start === this._data.length) {
            return start - 1
        }
        if (this._data[start].timestamp === timestamp) {
            return start
        } else {
            if (start === 0) {
                return this._data.length
            } else {
                return start - 1
            }
        }
    }

    findRight(timestamp) {
        var start = 0
        var end = this._data.length
        var idx;
        while (start < end) {
            idx = Math.floor((start + end) / 2)
            if (this._data[idx].timestamp <= timestamp) {
                start = idx + 1
            } else {
                end = idx
            }
        }
        if (start > 0 && this._data[start-1].timestamp === timestamp) {
            return start - 1
        }
        return start
    }

    getData(from, to) {
        var beginIdx = this.findRight(from)
        if (beginIdx === this._data.length) {
            return new DataView(this._data, 0, 0)
        }

        var endIdx = this.findLeft(to)

        if (endIdx === this._data.length) {
            return new DataView(this._data, 0, 0)
        }

        return new DataView(this._data, beginIdx, endIdx + 1)
    }

    getSample(idx) {
        return this._data[idx]
    }
}

try {
    module.exports = Model
} catch(err) {
    console.debug("Could not set module.exports, is this nodejs environment?")
}