import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import * as THREE from 'three'
import state from './state'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const initControl = () => {
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    // camera.up.set(0, 0, 1)
    camera.position.z = 5

    const scene = new Scene()
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    window.scene = scene
    window.THREE = THREE
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    cube.addEventListener('click', () => {
        console.log('object :>> ')
    })
    // scene.add(cube)

    state.scene = scene
    state.camera = camera
    state.renderer = renderer

    const controls = new OrbitControls(camera, renderer.domElement)

    const animate = function () {
        requestAnimationFrame(animate)

        controls.update()
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        // cone.lookAt(pointLight.position)
        render()
    }
    animate()

    function render() {
        renderer.render(scene, camera)
    }
}

export default function init() {
    initControl()
}
