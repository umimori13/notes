import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    MeshBasicMaterial,
    AmbientLight,
    Color,
    MeshPhongMaterial,
    HemisphereLight,
    sRGBEncoding,
    VertexColors,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import * as THREE from 'three'

const basicExample = () => {
    const camera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 10
    const scene = new Scene()
    scene.background = new Color(0x0)

    const container = document.createElement('div')
    document.body.appendChild(container)
    const renderer = new WebGLRenderer({})
    renderer.outputEncoding = sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const geo = new BoxGeometry(2, 2, 2)
    const mat = new MeshBasicMaterial({ color: 0xffffff })
    const cube = new Mesh(geo, mat)
    scene.add(cube)

    const amb = new AmbientLight(0x999999)
    scene.add(amb)

    const setting = {
        isAntialias: false,
    }
    const gui = new dat.GUI({})
    gui.add(setting, 'isAntialias')

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)

    scene.add(new HemisphereLight(0x443333, 0x111122))

    document.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
    }
    animate()
}

export default basicExample
