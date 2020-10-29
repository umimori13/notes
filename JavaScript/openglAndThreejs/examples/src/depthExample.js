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
    MeshDepthMaterial,
    MeshNormalMaterial,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const depthExample = () => {
    const camera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        100000000
    )
    camera.position.z = 10
    const scene = new Scene()
    scene.background = new Color(0x555555)

    const container = document.createElement('div')
    document.body.appendChild(container)

    let renderer
    renderer = new WebGLRenderer({})
    // const renderer = new WebGLRenderer({ logarithmicDepthBuffer: true })
    renderer.outputEncoding = sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const geo = new BoxGeometry(2, 2, 2)
    const mat = new MeshDepthMaterial({})
    const cube = new Mesh(geo, mat)
    scene.add(cube)

    const geo2 = new BoxGeometry(20, 2, 2)

    const cube2 = new Mesh(geo2, mat)
    scene.add(cube2)
    cube2.position.set(0.998, 0, 0)

    const geo3 = new BoxGeometry(200, 200, 200)
    const mat3 = new MeshNormalMaterial()
    const cube3 = new Mesh(geo3, mat3)
    cube3.position.set(2000, 0, 0)
    scene.add(cube3)

    const mat4 = new MeshBasicMaterial({ color: 0xff00 })
    const cube4 = new Mesh(geo3, mat4)
    cube4.position.set(2000.1, 140, 0)
    scene.add(cube4)

    const amb = new AmbientLight(0x999999)
    scene.add(amb)

    const setting = {
        isAntialias: false,
    }
    // const gui = new dat.GUI({})
    // gui.add(setting, 'isAntialias')

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

export default depthExample
