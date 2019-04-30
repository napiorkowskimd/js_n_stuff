'use strict';

class Plotter {
    /**
     * 
     * @param {HTMLElement} parent 
     */
    constructor(parent) {
        this._parent = parent
        this._model = null

        this._canvas = document.createElement('canvas')
        this._canvas.width = 800
        this._offCanvas = document.createElement('canvas')
        this._offCanvas.style.display = "none"
        this._parent.appendChild(this._canvas)
        this._parent.appendChild(this._offCanvas)
        this.onResize()

        this._pixelsPerMs = 20 / 100

        this._displayedMaxTime = -Infinity
        this._displayedMinTime = Infinity

        this._displayedMinSample = Infinity
        this._displayedMaxSample = -Infinity

        this._rightAnchor = this._width
    }

    addModel(model) {
        this._model = model
    }

    play() {
        this._animate()
    }

    onResize() {
        this._width = this._canvas.width
        this._height = this._canvas.height
        this._offCanvas.width = this._width
        this._offCanvas.height = this._height
    }

    _animate() {
        this._draw()
        requestAnimationFrame(this._animate.bind(this))
    }

    _timestampToPos(timestamp) {
        return this._width - Math.ceil((this._rightAnchor - timestamp) * this._pixelsPerMs)
    }

    _drawSamples(samples, ctx) {
        ctx.beginPath()
        ctx.strokeStyle = "red"
        let firstSample = samples.at(0)
        var prevX = this._timestampToPos(firstSample.timestamp)
        var prevY = firstSample.value
        ctx.moveTo(prevX, prevY)
        for (let i = 1; i < samples.length; ++i) {
            let x = this._timestampToPos(samples.at(i).timestamp)
            let y = samples.at(i).value
            ctx.lineTo(x, prevY)
            ctx.lineTo(x, y)
            prevY = y
        }
        ctx.stroke()

        if (samples.at(0).timestamp < this._displayedMinSample) {
            this._displayedMinSample = samples.at(0).timestamp
        }

        if (samples.at(samples.length - 1).timestamp > this._displayedMaxSample) {
            this._displayedMaxSample = samples.at(samples.length - 1).timestamp 
        }
    }

    _draw() {
        if (this._model === null) {
            return
        }

        var rMaxTime = performance.now()

        var tOffset = rMaxTime - this._displayedMaxTime

        var precXOffset = tOffset * this._pixelsPerMs
        var xOffset = Math.ceil(precXOffset)
        var ctx = this._canvas.getContext("2d")

        if (isFinite(xOffset)) {
            if (xOffset < 1) return;
            ctx.clearRect(0, 0, this._width, this._height)
            ctx.drawImage(this._offCanvas, -xOffset, 0)
    
            var timeInnacuracy = Math.abs(precXOffset - xOffset) / this._pixelsPerMs
    
            if (isNaN(timeInnacuracy) || !isFinite(timeInnacuracy)) {
                timeInnacuracy = 0
            }
            console.debug(timeInnacuracy)
            rMaxTime += timeInnacuracy
        }

        var rMinTime = rMaxTime - this._width / this._pixelsPerMs
        this._rightAnchor = rMaxTime

        var rightSamples = this._model.getData(this._displayedMaxSample, rMaxTime)
        if (rightSamples.length > 1)
            this._drawSamples(rightSamples, ctx)

        if (rMaxTime > this._displayedMaxSample) {
            let sampleIdx = this._model.findRight(this._displayedMaxSample)
            let sample = this._model.getSample(sampleIdx)
            if (sample !== undefined) {
                ctx.beginPath()
                ctx.moveTo(this._timestampToPos(sample.timestamp), sample.value)
                ctx.lineTo(this._timestampToPos(rMaxTime), sample.value)
                ctx.strokeStyle = "green"
                ctx.stroke()
            }
        }
        
        this._displayedMaxTime = rMaxTime
        this._displayedMinTime = rMinTime
        var offCtx = this._offCanvas.getContext("2d")
        offCtx.clearRect(0, 0, this._width, this._height)
        offCtx.drawImage(this._canvas, 0, 0)
    }
}