onmessage = function (event) {
    //向主线程发送event.data.name信息
    const pos = []
    const intensity = []
    const data = event.data.data.split('\n').map((val) => {
        const split = val.split(',')
        if (split.length < 4) return
        else {
            pos.push(split[0], split[1], split[2])
            intensity.push(split[3])
            return split
        }
    })
    const res = new Float32Array(pos)

    postMessage({
        buffer: res,
        intensity: intensity,
        id: event.data.id,
    })
}
