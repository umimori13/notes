import * as THREE from 'three'
import { LineCurve3, Vector3 } from 'three'
import FlyLine from './flyLine'

let container
let camera, scene, renderer
let cube

const initThree = () => {
    container = document.createElement('div')
    document.body.appendChild(container)

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
    )
    camera.position.z = 5

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0.5, 1, 0.25)
    scene.add(light)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    window.addEventListener('resize', onWindowResize, false)

    const linecurve = new LineCurve3(
        new Vector3(0, 0, 0),
        new Vector3(1.5, 1.5, 1.5)
    )
    const line = new FlyLine(linecurve, {
        color: 0xff00ff,
        segFlag: true,
        segment: 3.5, //必须是小数
    })
    console.log('line :>> ', line)
    scene.add(line)

    const render = (timestamp, frame) => {
        renderer.render(scene, camera)

        line.update(0.01)

        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
    }

    const animate = () => {
        renderer.setAnimationLoop(render)

        // // if using RequestAnimation()
        // requestAnimationFrame(animate)
        // render()
    }
    animate()
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

export { initThree }