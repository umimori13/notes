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
import { PointCloudOctree, Potree } from '@pnext/three-loader'
import store from './store'
// import { handleMouseMove } from './operation'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'

import { EyeDomeLightingMaterial } from './EdlMaterial'
import EdlRenderer from './EdlRenderer'
import generateClipBox from './clipboxes'
import { mouseRay } from './operation'
// import { InputHandler } from './navigation/InputHandler'
import * as dat from 'dat.gui'

import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { TextSprite } from './TextSprite.js'
import { Utils } from './utils-potree'
import { LengthUnits } from './defines'

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

const dragObjects = []
const edgeLabels = []

const createLine = () => {
    const geometry = new LineGeometry()

    geometry.setPositions([0, 0, 0, 0, 0, 0])

    const material = new LineMaterial({
        color: 0xff0000,
        linewidth: 2,
        resolution: new THREE.Vector2(1000, 1000),
        depthTest: false,
    })

    const line = new Line2(geometry, material)

    return line
}

const init = () => {
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

    const dragControls = new DragControls(
        dragObjects,
        camera,
        renderer.domElement
    )

    dragControls.addEventListener('drag', (e) => {
        // console.log('e.object :>> ', e.object)
        const { mouse } = store
        const sph = e.object
        const { renderer } = store.viewer
        // const rect = renderer.domElement.getBoundingClientRect()
        // let x = e.clientX - rect.left
        // let y = e.clientY - rect.top
        const { x, y } = mouse
        console.log('mouse :>> ', x, y)
        const { pointClouds, viewer } = store
        const { camera } = viewer
        const point = mouseRay(x, y, pointClouds, renderer, camera)
        if (point) {
            sph.position.copy(point.position)
        }
        console.log('sph.position :>> ', sph.position)
    })

    dragControls.addEventListener('dragstart', function () {
        controls.enabled = false
    })
    dragControls.addEventListener('dragend', function () {
        controls.enabled = true
    })

    store.viewer = {
        camera,
        scene,
        renderer,
        transformControl,
    }

    const gui = new dat.GUI({})

    // //固定位置球
    // const sph2 = new Mesh(geo, mat)
    // sph2.position.set(1, 1, 2)
    // scene.add(sph2)

    const beginAdd = () => {
        //跟随球
        const geo = new SphereGeometry(1, 64, 64)
        const mat = new MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            depthTest: false,
        })
        const sph = new Mesh(geo, mat)

        const { renderer, scene } = store.viewer
        scene.add(sph)
        store.sph = sph

        const line = createLine()
        store.edges.push(line)
        scene.add(line)

        {
            // edge labels
            let edgeLabel = new TextSprite()
            edgeLabel.setBorderColor({ r: 0, g: 0, b: 0, a: 1.0 })
            edgeLabel.setBackgroundColor({ r: 0, g: 0, b: 0, a: 1.0 })
            edgeLabel.material.depthTest = false
            edgeLabel.visible = false
            edgeLabel.fontsize = 16
            edgeLabels.push(edgeLabel)
            scene.add(edgeLabel)
        }
        renderer.domElement.addEventListener(
            'mousemove',
            handleMouseMove,
            false
        )
        renderer.domElement.addEventListener(
            'mousedown',
            handleMouseDown,
            false
        )
    }

    const mouseMove = (e) => {
        const { renderer } = store.viewer
        const rect = renderer.domElement.getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top
        const mouse = new Vector2(x, y)
        // console.log('mouse :>> ', rect)
        store.mouse = mouse
    }
    renderer.domElement.addEventListener('mousemove', mouseMove, false)

    const handleMouseMove = (e) => {
        // console.log('e.type :>> ', e.type)
        const { renderer } = store.viewer
        const rect = renderer.domElement.getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top
        const mouse = new Vector2(x, y)
        // console.log('mouse :>> ', rect)
        const { sph } = store
        sph.dispatchEvent({
            type: 'drag',
            mouse,
        })
        ;[x, y] = [event.pageX, event.pageY]
        const { pointClouds, viewer } = store
        const { camera } = viewer
        const point = mouseRay(x, y, pointClouds, renderer, camera)
        if (point) {
            sph.position.copy(point.position)
        }
    }

    const addSph = () => {
        let { sph } = store
        dragObjects.push(sph)

        const geo = new SphereGeometry(1, 64, 64)
        const mat = new MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
        })
        sph = new Mesh(geo, mat)

        const line = createLine()
        store.edges.push(line)
        scene.add(line)
        scene.add(sph)
        store.sph = sph
        sph.addEventListener('drag', handleSph)

        {
            // edge labels
            let edgeLabel = new TextSprite()
            edgeLabel.setBorderColor({ r: 0, g: 0, b: 0, a: 1.0 })
            edgeLabel.setBackgroundColor({ r: 0, g: 0, b: 0, a: 1.0 })
            edgeLabel.material.depthTest = false
            edgeLabel.visible = false
            edgeLabel.fontsize = 16
            edgeLabels.push(edgeLabel)
            scene.add(edgeLabel)
        }
        console.log('line :>> ', line)
    }

    const cancelAddSph = () => {
        const { sph } = store
        const { scene } = store.viewer
        scene.remove(sph)
        sph.geometry.dispose()
        sph.material.dispose()
        store.sph = null

        const line = store.edges.pop()
        line.geometry.dispose()
        line.material.dispose()
        scene.remove(line)

        renderer.domElement.removeEventListener(
            'mousemove',
            handleMouseMove,
            false
        )
        renderer.domElement.removeEventListener(
            'mousedown',
            handleMouseDown,
            false
        )
    }

    const handleMouseDown = (e) => {
        // console.log('e :>> ', e)
        switch (e.button) {
            case MOUSE.LEFT:
                addSph()
                break
            case MOUSE.RIGHT:
                cancelAddSph()
                break

            default:
                break
        }
    }

    const handleSph = (e) => {
        console.log('e :>> ', e)
    }

    const updateMeasure = () => {
        const { edges } = store
        dragObjects.forEach((val, i, arr) => {
            const index = i
            const lastIndex = arr.length - 1
            const nextIndex = i + 1 > lastIndex ? 0 : i + 1
            const previousIndex = i === 0 ? lastIndex : i - 1

            const point = arr[index]
            const nextPoint = arr[nextIndex]
            const previousPoint = arr[previousIndex]

            {
                // edges
                const edge = edges[index]

                // edge.material.color = 0x666666

                edge.position.copy(point.position)

                edge.geometry.setPositions([
                    0,
                    0,
                    0,
                    ...nextPoint.position.clone().sub(point.position).toArray(),
                ])

                edge.geometry.verticesNeedUpdate = true
                edge.geometry.computeBoundingSphere()
                edge.computeLineDistances()
                edge.visible = index < lastIndex
                // console.log('object :>> ', edge)
            }

            {
                let edgeLabel = edgeLabels[i]

                let center = new THREE.Vector3().add(point.position)
                center.add(nextPoint.position)
                center = center.multiplyScalar(0.5)
                let distance = point.position.distanceTo(nextPoint.position)

                edgeLabel.position.copy(center)

                let suffix = ''
                // if (this.lengthUnit != null && this.lengthUnitDisplay != null) {
                distance =
                    (distance / LengthUnits.METER.unitspermeter) *
                    LengthUnits.METER.unitspermeter //convert to meters then to the display unit
                suffix = LengthUnits.METER.code
                // }

                let txtLength = Utils.addCommas(distance.toFixed(2))
                edgeLabel.setText(`${txtLength} ${suffix}`)
                edgeLabel.visible =
                    index < lastIndex && arr.length >= 2 && distance > 0
            }
        })
    }

    const settings = {
        beginAdd,
    }
    gui.add(settings, 'beginAdd')

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
        edlRenderer.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onWindowResize, false)

    // Manages the necessary state for loading/updating one or more point clouds.
    const potree = new Potree()
    potree.pointBudget = 20000000

    const pointClouds = []
    store.pointClouds = pointClouds

    const edlRenderer = new EdlRenderer(renderer, pointClouds)

    const baseUrl = './pointcloud/'

    // const inputHandler = new InputHandler(this)

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

            // The point cloud comes with a material which can be customized directly.
            // Here we just set the size of the points.

            pco.material.pointSizeType = PointSizeType.ADAPTIVE

            // renderer.domElement.addEventListener(
            //     'mousemove',
            //     handleMouseMove,
            //     false
            // )
            // renderer.domElement.addEventListener(
            //     'mouseup',
            //     handleMouseDown,
            //     false
            // )

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
        updateMeasure()
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
export default init
