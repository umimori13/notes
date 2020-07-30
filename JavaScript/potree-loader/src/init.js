import {
    Vector3,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    OrbitControls,
} from 'three-full'
import { PointCloudOctree, Potree } from '@pnext/three-loader'
import store from './store'

const init = () => {
    // console.log(dataUrl)

    const scene = new Scene()
    const camera = new PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )
    camera.position.set(0, 0, -10)

    // camera.up.set(0, 0, 1)

    console.log('camera :>> ', camera)
    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    store.viewer = {
        camera,
        scene,
        renderer,
    }
    const controls = new OrbitControls(camera, renderer.domElement)

    const geo = new SphereGeometry(1, 64, 64)
    const mat = new MeshBasicMaterial({
        color: 0xffffff,
    })
    const sph = new Mesh(geo, mat)
    scene.add(sph)

    const sph2 = new Mesh(geo, mat)
    sph2.position.set(1, 1, 2)
    scene.add(sph2)

    // Manages the necessary state for loading/updating one or more point clouds.
    const potree = new Potree()
    potree.pointBudget = 2000000
    const pointClouds = []

    store.pointClouds = pointClouds

    const baseUrl = './pointcloud/'
    potree
        .loadPointCloud(
            // The name of the point cloud which is to be loaded.
            'cloud.js',
            // Given the relative URL of a file, should return a full URL (e.g. signed).
            (relativeUrl) => `${baseUrl}${relativeUrl}`
        )
        .then((pco) => {
            pointClouds.push(pco)
            scene.add(pco) // Add the loaded point cloud to your ThreeJS scene.

            // The point cloud comes with a material which can be customized directly.
            // Here we just set the size of the points.
            pco.material.size = 0.5
            pco.material.useEDL = true
            pco.material.updateShaderSource()

            // console.log(
            //     'pco.material.vertexShader :>> ',
            //     pco.material.vertexShader
            // )
            console.log('pco.material :>> ', pco.material)
            pco.material.pointSizeType = 2
        })
    update()

    function update() {
        requestAnimationFrame(update)
        // This is where most of the potree magic happens. It updates the visiblily of the octree nodes
        // based on the camera frustum and it triggers any loads/unloads which are necessary to keep the
        // number of visible points in check.
        potree.updatePointClouds(pointClouds, camera, renderer)
        controls.update()
        // Render your scene as normal
        renderer.clear()
        renderer.render(scene, camera)
    }
}
export default init
