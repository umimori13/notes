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
    SpotLight,
    PlaneGeometry,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loaderExample = () => {
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
    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const geo = new BoxGeometry(2, 2, 2)
    const mat = new MeshPhongMaterial({
        color: 0x808080,
        dithering: true,
    })
    const cube = new Mesh(geo, mat)
    cube.position.set(0, 5, 0)
    cube.receiveShadow = true
    cube.castShadow = true
    scene.add(cube)

    const spotLight = new SpotLight(0xffffff, 1)
    spotLight.position.set(0, 200, 0)
    spotLight.castShadow = true
    scene.add(spotLight)

    var material = new MeshPhongMaterial({
        color: 0x808080,
        dithering: true,
    })

    var geometry = new PlaneGeometry(2000, 2000)

    var mesh = new Mesh(geometry, material)
    mesh.position.set(0, -1, 0)
    mesh.rotation.x = -Math.PI * 0.5
    mesh.receiveShadow = true
    scene.add(mesh)

    const amb = new AmbientLight(0x999999)
    scene.add(amb)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)

    scene.add(new HemisphereLight(0x443333, 0x111122))

    new MTLLoader().load('11720_Curling_Stone_v1_L3.mtl', function (materials) {
        materials.preload()

        new OBJLoader()
            .setMaterials(materials)
            .load('11720_Curling_Stone_v1_L3.obj', function (object) {
                object.children[0].receiveShadow = true
                object.children[0].castShadow = true
                object.children[0].position.set(0, 10, 0)
                console.log('object :>> ', object)
                scene.add(object)
            })
    })

    new MTLLoader().load('curling.mtl', function (materials) {
        materials.preload()

        new OBJLoader()
            .setMaterials(materials)
            .load('curling.obj', function (object) {
                object.children[0].receiveShadow = true
                console.log('object :>> ', object)
                scene.add(object)
            })
    })
    // new GLTFLoader().load('curling.glb', (gltf) => {
    //     scene.add(gltf.scene)
    //     console.log('gltf :>> ', gltf)
    // })

    // const loader = new PLYLoader()
    // loader.load('./curling.ply', function (geometry) {
    //     geometry.computeVertexNormals()

    //     const material = new MeshPhongMaterial({
    //         color: 0xffffff,
    //         vertexColors: VertexColors,
    //     })

    //     const mesh = new Mesh(geometry, material)

    //     // mesh.position.y = -0.2
    //     // mesh.position.z = 0.3
    //     // mesh.rotation.x = -Math.PI / 2
    //     // mesh.scale.multiplyScalar(0.001)

    //     // mesh.castShadow = true
    //     // mesh.receiveShadow = true

    //     scene.add(mesh)
    //     console.log('scene :>> ', scene)
    //     console.log('mesh :>> ', mesh)
    // })

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
export default loaderExample
