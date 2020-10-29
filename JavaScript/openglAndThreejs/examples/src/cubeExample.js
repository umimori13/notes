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
    Group,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const cubeExample = () => {
    const camera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 10
    const scene = new Scene()
    scene.background = new Color(0x444444)

    const container = document.createElement('div')
    document.body.appendChild(container)

    const setting = {
        isAntialias: false,
    }
    const gui = new dat.GUI({})
    gui.add(setting, 'isAntialias')

    const renderer = new WebGLRenderer({ antialias: false })
    renderer.outputEncoding = sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const antialiasRenderer = new WebGLRenderer({ antialias: true })
    antialiasRenderer.outputEncoding = sRGBEncoding
    antialiasRenderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(antialiasRenderer.domElement)

    const geo = new BoxGeometry(2, 2, 2)
    const mat = new MeshBasicMaterial({ color: 0xffffff })
    const cube = new Mesh(geo, mat)

    const group = new Group()
    group.add(cube)
    scene.add(group)

    // scene.traverse((obj) => console.log('obj :>> ', obj.userData))

    const amb = new AmbientLight(0x999999)
    scene.add(amb)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)

    const AnControls = new OrbitControls(camera, antialiasRenderer.domElement)
    AnControls.target.set(0, 0, 0)

    scene.add(new HemisphereLight(0x443333, 0x111122))

    document.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const animate = () => {
        requestAnimationFrame(animate)
        if (setting.isAntialias) {
            renderer.domElement.style.display = 'none'
            antialiasRenderer.domElement.style.display = 'inline-block'
            antialiasRenderer.render(scene, camera)
            AnControls.update()
        } else {
            antialiasRenderer.domElement.style.display = 'none'
            renderer.domElement.style.display = 'inline-block'
            renderer.render(scene, camera)
            controls.update()
        }
    }
    animate()
}

export default cubeExample
