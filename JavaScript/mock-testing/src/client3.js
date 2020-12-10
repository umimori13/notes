import state from './state'
import {
    BufferAttribute,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
} from 'three'
import Worker from './read2.worker.js'

const clientGet = (url) => {
    const ws = new WebSocket(url)

    const worker = new Worker()
    let curtime = Date.now(),
        lastTime = Date.now(),
        frame = 0,
        lastFreme = 0,
        total = 0,
        frameCount = 0
    worker.onmessage = function (event) {
        // console.log('event.data :>> ', event.data)
        {
            let MAX_POINTS = 5000000

            frame++
            curtime = Date.now()
            if (curtime - lastTime >= 1000) {
                lastTime = curtime
                console.log('frame :>> ', frame - lastFreme)
                lastFreme = frame
                total += frame
                frameCount++
                console.log('fps :>> ', total / frameCount)
            }
            if (state.points) {
                const points = state.points

                const colors = points.geometry.attributes.color.array
                const color = new Color()
                // create a simple square shape. We duplicate the top left and bottom right
                // vertices because each vertex needs to appear once per triangle.
                const vertices = []

                const positions = points.geometry.attributes.position.array

                const buffer = event.data.buffer
                const intensity = event.data.intensity
                // event.data.intensity.some((val, idx) => {
                //     if (val) {
                //         // vertices.push(val[0], val[1], val[2])
                //         if (idx >= MAX_POINTS) return true

                //         positions[idx * 3] = buffer[idx * 3]
                //         positions[idx * 3 + 1] = buffer[idx * 3 + 1]
                //         positions[idx * 3 + 2] = buffer[idx * 3 + 2]
                //         // const a = Math.round(val * 1.1)
                //         // const b = Math.round(val * 1.1)
                //         // color.setStyle(`rgb(${a},${b},200)`)
                //         colors[idx * 3] = color.r
                //         colors[idx * 3 + 1] = color.g
                //         colors[idx * 3 + 2] = color.b
                //     }
                // })
                event.data.buffer.some((val, idx) => {
                    if (val) {
                        positions[idx] = val
                        colors[idx] = intensity[idx]
                        // positions[idx * 3 + 1] = val[1]
                        // positions[idx * 3 + 2] = val[2]
                    }
                })
                // itemSize = 3 because there are 3 values (components) per vertex

                points.geometry.setDrawRange(0, event.data.intensity.length)
                points.geometry.attributes.position.needsUpdate = true
                points.geometry.attributes.color.needsUpdate = true
                points.geometry.computeBoundingSphere()
            } else {
                const { scene } = state
                const geometry = new BufferGeometry()
                const colors = new Float32Array(MAX_POINTS * 3)
                const color = new Color()
                // create a simple square shape. We duplicate the top left and bottom right
                // vertices because each vertex needs to appear once per triangle.
                const vertices = []
                const positions = event.data.buffer

                event.data.intensity.forEach((val, idx) => {
                    if (val) {
                        // vertices.push(val[0], val[1], val[2])
                        const a = Math.round(val * 1.1)
                        const b = Math.round(val * 1.1)
                        color.setStyle(`rgb(${a},${b},200)`)
                        colors[idx * 3] = color.r
                        colors[idx * 3 + 1] = color.g
                        colors[idx * 3 + 2] = color.b
                    }
                })
                // itemSize = 3 because there are 3 values (components) per vertex
                geometry.setAttribute(
                    'position',
                    new BufferAttribute(positions, 3)
                )
                geometry.setAttribute('color', new BufferAttribute(colors, 3))
                geometry.computeBoundingSphere()

                const material = new PointsMaterial({
                    size: 0.38,
                    vertexColors: true,
                })

                const points = new Points(geometry, material)
                points.position.set(6, 15, 0)
                points.rotation.set(0, -0.06, -3.02)
                points.scale.set(0.1, 0.1, 0.1)
                state.points = points
                scene.add(points)
                console.log('data :>> ', geometry)
                console.log('data :>> ', points)
            }
        }
    }

    ws.onopen = function (evt) {
        console.log('Connection open ...')
        ws.send('Hello WebSockets!')
        setTimeout(() => ws.send('Please give me data!'), 1000)
    }
    let count = 0
    ws.onmessage = function (evt) {
        if (evt.data === 'Done!') {
            ws.close()
        } else {
            if (evt.data.length < 5) {
                // console.log('frame :>> ', evt.data)
            } else {
                worker.postMessage({
                    data: evt.data,
                    id: count,
                })
            }
        }

        count++
    }

    // ws.onmessage = function (evt) {
    //     // console.log('Received Message: ' + evt.data)

    //     if (evt.data === 'Done!') {
    //         ws.close()
    //     } else {
    //         if (evt.data.length < 5) {
    //             console.log('frame :>> ', evt.data)
    //         } else {
    //             let MAX_POINTS = 5000000
    //             if (state.points) {
    //                 const points = state.points
    //                 const data = evt.data.split('\r\n').map((val) => {
    //                     const split = val.split(',')
    //                     if (split.length < 4) return
    //                     else return split
    //                 })

    //                 const colors = points.geometry.attributes.color.array
    //                 const color = new Color()
    //                 // create a simple square shape. We duplicate the top left and bottom right
    //                 // vertices because each vertex needs to appear once per triangle.
    //                 const vertices = []

    //                 const positions = points.geometry.attributes.position.array

    //                 data.some((val, idx) => {
    //                     if (val) {
    //                         // vertices.push(val[0], val[1], val[2])
    //                         if (idx >= MAX_POINTS) return true
    //                         positions[idx * 3] = val[0]
    //                         positions[idx * 3 + 1] = val[1]
    //                         positions[idx * 3 + 2] = val[2]
    //                         const a = Math.round(val[3] * 1.1)
    //                         const b = Math.round(val[3] * 1.1)
    //                         color.setStyle(`rgb(${a},${b},200)`)
    //                         colors[idx * 3] = color.r
    //                         colors[idx * 3 + 1] = color.g
    //                         colors[idx * 3 + 2] = color.b
    //                     }
    //                 })
    //                 // itemSize = 3 because there are 3 values (components) per vertex

    //                 points.geometry.setDrawRange(0, data.length)
    //                 points.geometry.attributes.position.needsUpdate = true
    //                 points.geometry.attributes.color.needsUpdate = true
    //                 points.geometry.computeBoundingSphere()
    //             } else {
    //                 const data = evt.data.split('\r\n').map((val) => {
    //                     const split = val.split(',')
    //                     if (split.length < 4) return
    //                     else return split
    //                 })
    //                 const { scene } = state
    //                 const geometry = new BufferGeometry()
    //                 const colors = new Float32Array(MAX_POINTS * 3)
    //                 const color = new Color()
    //                 // create a simple square shape. We duplicate the top left and bottom right
    //                 // vertices because each vertex needs to appear once per triangle.
    //                 const vertices = []
    //                 const positions = new Float32Array(MAX_POINTS * 3)

    //                 data.forEach((val, idx) => {
    //                     if (val) {
    //                         // vertices.push(val[0], val[1], val[2])
    //                         positions[idx * 3] = val[0]
    //                         positions[idx * 3 + 1] = val[1]
    //                         positions[idx * 3 + 2] = val[2]
    //                         const a = Math.round(val[3] * 1.1)
    //                         const b = Math.round(val[3] * 1.1)
    //                         color.setStyle(`rgb(${a},${b},200)`)
    //                         colors[idx * 3] = color.r
    //                         colors[idx * 3 + 1] = color.g
    //                         colors[idx * 3 + 2] = color.b
    //                     }
    //                 })
    //                 // itemSize = 3 because there are 3 values (components) per vertex
    //                 geometry.setAttribute(
    //                     'position',
    //                     new BufferAttribute(positions, 3)
    //                 )
    //                 geometry.setAttribute(
    //                     'color',
    //                     new BufferAttribute(colors, 3)
    //                 )
    //                 geometry.computeBoundingSphere()

    //                 const material = new PointsMaterial({
    //                     size: 0.38,
    //                     vertexColors: true,
    //                 })

    //                 const points = new Points(geometry, material)
    //                 points.position.set(6, 15, 0)
    //                 points.rotation.set(0, -0.06, -3.02)
    //                 points.scale.set(0.1, 0.1, 0.1)
    //                 state.points = points
    //                 scene.add(points)
    //                 console.log('data :>> ', geometry)
    //                 console.log('data :>> ', points)
    //             }
    //         }
    //     }
    // }

    ws.onclose = function (evt) {
        console.log('Connection closed.')
    }
    console.log('theClient :>> ', ws)
}
export default clientGet
