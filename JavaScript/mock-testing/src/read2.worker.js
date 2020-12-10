onmessage = function (event) {
    //向主线程发送event.data.name信息
    const pos = []
    const intensity = []
    const data = event.data.data.split('\n').map((val) => {
        const split = val.split(',')
        if (split.length < 4) return
        else {
            pos.push(split[0], split[1], split[2])
            const a =
                Math.min(255, parseInt(Math.round(split[3] * 1.1), 10)) / 255
            const b =
                Math.min(255, parseInt(Math.round(split[3] * 1.1), 10)) / 255
            const c = Math.min(255, parseInt(200, 10)) / 255
            // color.setStyle(`rgb(${a},${b},200)`)
            // colors[idx * 3] = color.r
            // colors[idx * 3 + 1] = color.g
            // colors[idx * 3 + 2] = color.b
            intensity.push(a, b, c)
            return split
        }
    })
    const res = new Float32Array(pos)
    const resIntensity = new Float32Array(intensity)

    postMessage({
        buffer: res,
        intensity: resIntensity,
        id: event.data.id,
    })
}
