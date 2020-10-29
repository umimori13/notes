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
    MeshPhysicalMaterial,
    PointLight,
    DirectionalLight,
} from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const lightExample = () => {
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
    const mat = new MeshPhysicalMaterial({ color: 0x222222 })
    const cube = new Mesh(geo, mat)
    console.log('cube :>> ', cube)
    scene.add(cube)

    const amb = new AmbientLight(0xdddddd)
    scene.add(amb)

    const directLight = new DirectionalLight(0xffffff, 0.5)
    directLight.visible = false
    scene.add(directLight)
    directLight.position.set(5, 5, 5)
    const helper = new THREE.DirectionalLightHelper(directLight, 3)
    helper.visible = false
    scene.add(helper)

    const pointLight = new PointLight(0xbbbbbb, 1)
    pointLight.visible = false
    scene.add(pointLight)
    pointLight.add(
        new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.5, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        )
    )

    const hemiLight = new THREE.HemisphereLight(0x00ffbb, 0x080820, 1)
    hemiLight.visible = false
    scene.add(hemiLight)

    const showAmb = () => {
        amb.visible = !amb.visible
    }
    const showPoint = () => {
        pointLight.visible = !pointLight.visible
    }
    const showDirect = () => {
        directLight.visible = !directLight.visible
        helper.visible = !helper.visible
    }
    const showHemi = () => {
        hemiLight.visible = !hemiLight.visible
    }
    let isWhite = true
    const switchBackground = () => {
        if (isWhite) {
            scene.background = new Color(0xffffff)
            isWhite = false
        } else {
            isWhite = true
            scene.background = new Color(0x0)
        }
    }

    const setting = {
        showAmb,
        showPoint,
        showDirect,
        showHemi,
        switchBackground,
    }
    const gui = new dat.GUI({})
    gui.add(setting, 'showAmb')
    gui.add(setting, 'showPoint')
    gui.add(setting, 'showDirect')
    gui.add(setting, 'showHemi')
    gui.add(setting, 'switchBackground')

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)

    // scene.add(new HemisphereLight(0x443333, 0x111122))

    document.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const animate = () => {
        requestAnimationFrame(animate)

        var timer = 0.0001 * Date.now()
        // console.log(' Math.sin(timer * 7) :>> ', 0xffffff * Math.sin(timer * 7))
        // console.log('timer :>> ', timer)
        // scene.background = new Color(0xffffff * Math.sin(timer))
        pointLight.position.x = Math.sin(timer * 7) * 3
        pointLight.position.y = Math.cos(timer * 5) * 4
        pointLight.position.z = Math.cos(timer * 3) * 3

        controls.update()
        renderer.render(scene, camera)
    }
    animate()
}

export default lightExample
