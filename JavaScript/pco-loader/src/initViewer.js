import {
    Vector3,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Geometry,
    Vector2,
} from 'three'
import { Potree } from '@pnext/three-loader'
import store from './store'
// import { handleMouseMove } from './operation'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import EdlRenderer from './EdlRenderer'
import { InputHandler } from './inputHandler'
import Utils from './utils'

let isUseEdl = true

const ClipMode = {
    DISABLED: 0,
    CLIP_OUTSIDE: 1,
    HIGHLIGHT_INSIDE: 2,
}

const PointSizeType = {
    FIXED: 0,
    ATTENUATED: 1,
    ADAPTIVE: 2,
}

const MOUSE = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
}

const initViewer = () => {
    const scene = new Scene()
    const sceneBG = new Scene()
    sceneBG.background = new THREE.Color(0x444444)

    const scenePC = new Scene()
    const camera = new PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )
    camera.position.set(0, 0, 30)
    camera.up.set(0, 0, 1)

    const renderer = new WebGLRenderer({
        alpha: true,
        premultipliedAlpha: false,
    })
    renderer.sortObjects = false
    renderer.setSize(window.innerWidth, window.innerHeight)
    //edl渲染会需要改变渲染不同画面和顺序，因此需手动clear
    renderer.autoClear = false
    document.body.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    //平移控制，是使用box盒的
    const transformControl = new TransformControls(camera, renderer.domElement)
    transformControl.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value
    })
    scene.add(transformControl)
    store.viewer = {
        camera,
        scene,
        renderer,
        transformControl,
    }
    const handler = new InputHandler(store.viewer)
    handler.setScene(scene)

    store.viewer.inputHandler = handler

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
        edlRenderer.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onWindowResize, false)

    // const inputHandler = new InputHandler(this)

    const geo = new SphereGeometry(1, 64, 64)
    const mat = new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
    })
    let sph = new Mesh(geo, mat)
    scene.add(sph)

    const setPosition = (point, position) => {
        point.position.copy(position)

        let event = {
            type: 'marker_moved',
            // measure: this,
            // index: index,
            position: position.clone(),
        }
        // this.dispatchEvent(event)

        updateMeasure()
    }

    const updateMeasure = () => {}

    sph.addEventListener('drag', (e) => {
        let I = Utils.getMousePointCloudIntersection(
            e.drag.end,
            camera,
            renderer,
            pointClouds,
            { pickClipped: true }
        )

        if (I) {
            // let i = this.spheres.indexOf(e.drag.object)
            // if (i !== -1) {
            //     let point = this.points[i]
            //     for (let key of Object.keys(I.point).filter(
            //         (e) => e !== 'position'
            //     )) {
            //         point[key] = I.point[key]
            //     }
            if (e.drag.object) setPosition(e.drag.object, I.location)
            // }
        }
    })

    // Manages the necessary state for loading/updating one or more point clouds.
    const potree = new Potree()
    potree.pointBudget = 20000000

    const pointClouds = []
    store.pointClouds = pointClouds

    const edlRenderer = new EdlRenderer(renderer, pointClouds)

    // const baseUrl = './pointcloud/'
    const baseUrl = 'https://staging02.stereye.tech/pointclouds/testpoint360/'
    potree
        .loadPointCloud(
            // The name of the point cloud which is to be loaded.
            'cloud.js',
            // Given the relative URL of a file, should return a full URL (e.g. signed).
            //example : baseUrl = './pointcloud/'
            //`${baseUrl}${relativeUrl}`=> './pointcloud/cloud.js'
            (relativeUrl) => `${baseUrl}${relativeUrl}`
        )
        .then((pco) => {
            pointClouds.push(pco)
            scenePC.add(pco) // Add the loaded point cloud to your ThreeJS scene.

            console.log('pco :>> ', pco);
            // The point cloud comes with a material which can be customized directly.
            // Here we just set the size of the points.

            pco.material.pointSizeType = PointSizeType.ADAPTIVE

            // generateClipBox(pco)
            // pco.material.clipMode = ClipMode.CLIP_OUTSIDE
        })
    update()

    function update(t) {
        requestAnimationFrame(update)

        // This is where most of the potree magic happens. It updates the visiblily of the octree nodes
        // based on the camera frustum and it triggers any loads/unloads which are necessary to keep the
        // number of visible points in check.
        potree.updatePointClouds(pointClouds, camera, renderer)
        controls.update()

        // if (pointClouds.length) {
        //     const [pco] = pointClouds
        //     const { clipBoxes } = store
        //     // console.log('object :>> ', clipBoxes)
        //     clipBoxes.forEach((clipbox) => {
        //         const box = clipbox.box
        //         clipbox.inverse = new THREE.Matrix4().getInverse(
        //             box.matrixWorld
        //         )
        //         clipbox.boxPosition = box.getWorldPosition(new THREE.Vector3())
        //         clipbox.matrix = box.matrixWorld
        //     })
        //     pco.material.setClipBoxes(clipBoxes)
        // }

        //清空画布，并渲染背景（如果是纯色也可选择用renderer的clearcolor作为背景）
        renderer.clear()
        renderer.render(sceneBG, camera)

        //渲染点云，可切换
        if (isUseEdl) {
            edlRenderer.render(scenePC, camera)
        } else {
            renderer.render(scenePC, camera)
        }

        //渲染一般物体（非点云）
        renderer.render(scene, camera)
        // }
    }
}

export default initViewer
