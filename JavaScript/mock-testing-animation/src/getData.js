import state from './state'
import Axios from 'axios'
import {
    BufferAttribute,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
} from 'three'

const getData = (id) => {
    Axios.get('http://localhost:8090/mode2/DataOne')
        .then((res) => {
            console.log('res :>> ', res)
            if (res.data) {
                const MAX_POINTS = 20000
                if (state.points) {
                    const points = state.points
                    const data = res.data.split('\r\n').map((val) => {
                        const split = val.split(',')
                        if (split.length < 4) return
                        else return split
                    })

                    const colors = points.geometry.attributes.color.array
                    const color = new Color()
                    // create a simple square shape. We duplicate the top left and bottom right
                    // vertices because each vertex needs to appear once per triangle.
                    const vertices = []

                    const positions = points.geometry.attributes.position.array

                    data.some((val, idx) => {
                        if (val) {
                            // vertices.push(val[0], val[1], val[2])
                            if (idx >= MAX_POINTS) return true
                            positions[idx * 3] = val[0]
                            positions[idx * 3 + 1] = val[1]
                            positions[idx * 3 + 2] = val[2]
                            const a = Math.round(val[3] * 1.1)
                            const b = Math.round(val[3] * 1.1)
                            color.setStyle(`rgb(${a},${b},200)`)
                            colors[idx * 3] = color.r
                            colors[idx * 3 + 1] = color.g
                            colors[idx * 3 + 2] = color.b
                        }
                    })
                    // itemSize = 3 because there are 3 values (components) per vertex

                    points.geometry.attributes.position.needsUpdate = true
                    points.geometry.attributes.color.needsUpdate = true
                    points.geometry.computeBoundingSphere()
                } else {
                    const data = res.data.split('\r\n').map((val) => {
                        const split = val.split(',')
                        if (split.length < 4) return
                        else return split
                    })
                    const { scene } = state
                    const geometry = new BufferGeometry()
                    const colors = new Float32Array(MAX_POINTS * 3)
                    const color = new Color()
                    // create a simple square shape. We duplicate the top left and bottom right
                    // vertices because each vertex needs to appear once per triangle.
                    const vertices = []
                    const positions = new Float32Array(MAX_POINTS * 3)

                    data.forEach((val, idx) => {
                        if (val) {
                            // vertices.push(val[0], val[1], val[2])
                            positions[idx * 3] = val[0]
                            positions[idx * 3 + 1] = val[1]
                            positions[idx * 3 + 2] = val[2]
                            const a = Math.round(val[3] * 1.1)
                            const b = Math.round(val[3] * 1.1)
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
                    geometry.setAttribute(
                        'color',
                        new BufferAttribute(colors, 3)
                    )
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
            } else {
                clearInterval(id)
            }
        })
        .catch((e) => {
            clearInterval(id)
        })
}
export default getData
