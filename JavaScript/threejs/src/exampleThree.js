import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import * as THREE from 'three'
let ThreeControl = {}
let cube

const initControl = () => {
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 5

    const scene = new Scene()
    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    cube.addEventListener('click',()=>{
        console.log('object :>> ', );
    })
    scene.add(cube)
    ThreeControl = {
        camera,
        scene,
        renderer,
    }
}

const animate = function () {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    // cone.lookAt(pointLight.position)
    render()
}

function render() {
    const { renderer, scene, camera } = ThreeControl
    renderer.render(scene, camera)
}

export default function init() {
    initControl()
    animate()
}
