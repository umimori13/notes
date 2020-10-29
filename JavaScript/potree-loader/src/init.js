import {
    Vector3,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Geometry,
} from 'three'
import { PointCloudOctree, Potree } from '@pnext/three-loader'
import store from './store'
import { handleMouseMove, handleMouseDown } from './operation'
// import { OrbitControls } from 'three-full'
import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import * as dat from 'dat.gui'
import { EyeDomeLightingMaterial } from './EdlMaterial'
import EdlRenderer from './edlRenderer'
import { PanoramaControls } from './PanoramaControls'
// import { OrbitControls } from './OrbitControls'

let isUseEdl = true

let status = {}

const screenPass = new (function () {
    this.screenScene = new THREE.Scene()
    this.screenQuad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 0))
    this.screenQuad.material.depthTest = true
    this.screenQuad.material.depthWrite = true
    this.screenQuad.material.transparent = true
    this.screenScene.add(this.screenQuad)
    this.camera = new THREE.Camera()

    this.render = function (renderer, material, camera, target) {
        this.screenQuad.material = material
        if (typeof target === 'undefined') {
            renderer.render(this.screenScene, this.camera)
        } else {
            renderer.render(this.screenScene, this.camera, target)
        }
    }
})()

const init = () => {
    // console.log(dataUrl)
    const scene = new Scene()
    const sceneBG = new Scene()
    const scenePC = new Scene()
    const camera = new PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )
    camera.position.set(0, 0, 1)
    camera.up.set(0, 0, 1)
    sceneBG.background = new THREE.Color(0x0000ff)

    // camera.up.set(0, 0, 1)

    const renderer = new WebGLRenderer({
        alpha: true,
        premultipliedAlpha: false,
    })
    renderer.sortObjects = false
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.autoClear = false
    document.body.appendChild(renderer.domElement)
    store.viewer = {
        camera,
        scene,
        renderer,
    }
    var clock = new THREE.Clock()
    // const controls = new OrbitControls(camera, renderer.domElement)
    const controls = new PanoramaControls(camera, renderer.domElement)

    const transformControl = new TransformControls(camera, renderer.domElement)
    transformControl.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value
    })
    scene.add(transformControl)
    // scene.background =

    const geo = new SphereGeometry(1, 64, 64)
    const mat = new MeshBasicMaterial({
        color: 0xffffff,
    })
    const sph = new Mesh(geo, mat)
    scene.add(sph)

    const sph2 = new Mesh(geo, mat)
    sph2.position.set(1, 1, 2)
    scene.add(sph2)
    store.sph = sph

    // Manages the necessary state for loading/updating one or more point clouds.
    const potree = new Potree()
    potree.pointBudget = 20000000
    const pointClouds = []

    store.pointClouds = pointClouds

    const gui = new dat.GUI({
        autoPlace: false,
    })
    const changeToScale = () => {
        transformControl.setMode('scale')
    }
    const changeToTrans = () => {
        transformControl.setMode('translate')
    }
    const setting = {
        改为缩放模式: changeToScale,
        改为平移模式: changeToTrans,
    }
    const fc = gui.addFolder('改变控制')
    fc.add(setting, '改为缩放模式')
    fc.add(setting, '改为平移模式')
    const div = document.createElement('div')
    div.style.zIndex = 4
    div.style.position = 'fixed'
    div.style.right = '5%'
    div.style.top = 0
    div.id = 'guiContainer'
    div.appendChild(gui.domElement)
    document.body.appendChild(div)

    const edlRenderer = new EdlRenderer(renderer, pointClouds)

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
            scenePC.add(pco) // Add the loaded point cloud to your ThreeJS scene.

            // The point cloud comes with a material which can be customized directly.
            // Here we just set the size of the points.
            pco.material.size = 0.5
            // pco.material.useEDL = false
            // pco.material.updateShaderSource()
            // pco.material.depthTest = false
            // pco.material.depthWrite = false

            let material = pco.material
            material.weighted = false
            material.useLogarithmicDepthBuffer = false
            material.uniforms.visibleNodes.value =
                pco.material.visibleNodesTexture
            material.useEDL = true

            material.spacing =
                pco.pcoGeometry.spacing *
                Math.max(pco.scale.x, pco.scale.y, pco.scale.z)
            // renderer.setRenderTarget(status.rtEDL)
            // console.log(
            //     'pco.material.vertexShader :>> ',
            //     pco.material.vertexShader
            // )
            console.log('pco.material :>> ', pco.material)
            pco.material.pointSizeType = 0

            renderer.domElement.addEventListener(
                'mousemove',
                handleMouseMove,
                false
            )
            renderer.domElement.addEventListener(
                'mouseup',
                handleMouseDown,
                false
            )

            const { clipBoxes } = store
            {
                {
                    let boxGeometry = new THREE.BoxGeometry(1, 1, 1)
                    boxGeometry.computeBoundingBox()
                    let boxFrameGeometry = new THREE.Geometry()
                    {
                        // bottom
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, -0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, -0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, -0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, -0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, -0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, -0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, -0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, -0.5, 0.5)
                        )
                        // top
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, 0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, 0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, 0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, 0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, 0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, 0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, 0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, 0.5, 0.5)
                        )
                        // sides
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, -0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, 0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, -0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, 0.5, 0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, -0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(0.5, 0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, -0.5, -0.5)
                        )
                        boxFrameGeometry.vertices.push(
                            new THREE.Vector3(-0.5, 0.5, -0.5)
                        )
                    }
                    const material = new THREE.MeshBasicMaterial({
                        color: 0x00ff00,
                        transparent: true,
                        opacity: 0.3,
                        depthTest: true,
                        depthWrite: false,
                    })
                    const box = new THREE.Mesh(boxGeometry, material)
                    box.geometry.computeBoundingBox()
                    const boundingBox = box.geometry.boundingBox
                    const frame = new THREE.LineSegments(
                        boxFrameGeometry,
                        new THREE.LineBasicMaterial({ color: 0x000000 })
                    )
                    box.scale.set(10, 10, 10)
                    box.updateMatrix()
                    box.updateMatrixWorld()
                    frame.scale.set(10, 10, 10)
                    box.userData.frame = frame
                    scene.add(box)
                    scene.add(frame)
                    // const box = new Mesh
                    let boxInverse = new THREE.Matrix4().getInverse(
                        box.matrixWorld
                    )
                    let boxPosition = box.getWorldPosition(new THREE.Vector3())
                    const clipBox = {
                        box,
                        inverse: boxInverse,
                        matrix: box.matrixWorld,
                        position: boxPosition,
                    }
                    clipBoxes.push(clipBox)
                    pco.material.setClipBoxes(clipBoxes)
                    transformControl.attach(box)
                }
                {
                    // let boxGeometry = new THREE.BoxGeometry(1, 1, 1)
                    // boxGeometry.computeBoundingBox()
                    // let boxFrameGeometry = new THREE.Geometry()
                    // {
                    //     // bottom
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, -0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, -0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, -0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, -0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, -0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, -0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, -0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, -0.5, 0.5)
                    //     )
                    //     // top
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, 0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, 0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, 0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, 0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, 0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, 0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, 0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, 0.5, 0.5)
                    //     )
                    //     // sides
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, -0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, 0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, -0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, 0.5, 0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, -0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(0.5, 0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, -0.5, -0.5)
                    //     )
                    //     boxFrameGeometry.vertices.push(
                    //         new THREE.Vector3(-0.5, 0.5, -0.5)
                    //     )
                    // }
                    // const material = new THREE.MeshBasicMaterial({
                    //     color: 0x00ff00,
                    //     transparent: true,
                    //     opacity: 0.3,
                    //     depthTest: true,
                    //     depthWrite: false,
                    // })
                    // const box = new THREE.Mesh(boxGeometry, material)
                    // box.geometry.computeBoundingBox()
                    // const boundingBox = box.geometry.boundingBox
                    // const frame = new THREE.LineSegments(
                    //     boxFrameGeometry,
                    //     new THREE.LineBasicMaterial({ color: 0x000000 })
                    // )
                    // box.scale.set(20, 20, 10)
                    // box.position.set(10, 10, 0)
                    // box.updateMatrix()
                    // box.updateMatrixWorld()
                    // frame.scale.set(20, 20, 10)
                    // frame.position.set(10, 10, 0)
                    // scene.add(box)
                    // scene.add(frame)
                    // // const box = new Mesh
                    // let boxInverse = new THREE.Matrix4().getInverse(
                    //     box.matrixWorld
                    // )
                    // let boxPosition = box.getWorldPosition(new THREE.Vector3())
                    // const clipBox = {
                    //     box,
                    //     inverse: boxInverse,
                    //     matrix: box.matrixWorld,
                    //     position: boxPosition,
                    // }
                    // clipBoxes.push(clipBox)
                    // pco.material.setClipBoxes(clipBoxes)
                }
            }

            pco.material.clipMode = 2
        })
    update()

    function update(t) {
        requestAnimationFrame(update)
        // const curTime = d.getTime()

        // This is where most of the potree magic happens. It updates the visiblily of the octree nodes
        // based on the camera frustum and it triggers any loads/unloads which are necessary to keep the
        // number of visible points in check.
        potree.updatePointClouds(pointClouds, camera, renderer)
        // controls.update(clock.getDelta())
        // console.log('time :>> ', curTime)

        // if (t - lastTime > 1000) {
        //     lastTime = t
        // console.log('t :>> ', t)
        // console.log('clock.getDelta() :>> ', clock.getDelta())

        if (pointClouds.length) {
            const [pco] = pointClouds
            const { clipBoxes } = store
            // console.log('object :>> ', clipBoxes)
            clipBoxes.forEach((clipbox) => {
                const box = clipbox.box
                clipbox.inverse = new THREE.Matrix4().getInverse(
                    box.matrixWorld
                )
                clipbox.boxPosition = box.getWorldPosition(new THREE.Vector3())
                clipbox.matrix = box.matrixWorld
            })
            pco.material.setClipBoxes(clipBoxes)
        }
        // Render your scene as normal

        renderer.clear()
        if (isUseEdl) {
            edlRenderer.render(scenePC, camera)
        } else {
            renderer.render(scenePC, camera)
        }
        renderer.render(scene, camera)
        // }
    }
}
export default init
