import * as THREE from 'three'
import { InputHandler } from './inputHandler'
import { TransformationTool } from './TransformationTool'

let container
let camera, scene, renderer
let cube, transform

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
    geometry.computeBoundingBox()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    cube.boundingBox = geometry.boundingBox
    scene.add(cube)

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0.5, 1, 0.25)
    scene.add(light)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.autoClear = false
    container.appendChild(renderer.domElement)

    cube.addEventListener('select', () => {})
    cube.addEventListener('deselect', () => {})

    const handler = new InputHandler(camera, renderer.domElement)
    handler.setScene(scene)

    transform = new TransformationTool(camera, renderer, handler)

    window.addEventListener('resize', onWindowResize, false)
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

const render = (timestamp, frame) => {
    renderer.render(scene, camera)
    transform.render()

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
}

const animate = () => {
    renderer.setAnimationLoop(render)

    // // if using RequestAnimation()
    // requestAnimationFrame(animate)
    // render()
}

export { initThree, animate }
