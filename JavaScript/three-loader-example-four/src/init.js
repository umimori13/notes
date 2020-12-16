import {
    Vector3,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Geometry,
    Color,
    Clock,
    TextureLoader,
    Raycaster,
} from 'three'
import { PointCloudOctree, Potree } from '@pnext/three-loader'
import store from './store'
import { handleMouseDown, mouseRay } from './operation'
import { OrbitControls } from 'three-full'
import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import { EyeDomeLightingMaterial } from './EdlMaterial'
import EdlRenderer from './edlRenderer'
import generateClipBox from './clipboxes'
import Axios from 'axios'
import { IndoorControls } from 'indoorcontrols'

let isUseEdl = false
let changeView = true

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

const init = () => {
    const scene = new Scene()
    const sceneBG = new Scene()
    sceneBG.background = new THREE.Color(0x444444)

    const scenePC = new Scene()
    // const camera = new PerspectiveCamera(
    //     60,
    //     window.innerWidth / window.innerHeight,
    //     0.01,
    //     1000
    // )
    // camera.position.set(0, 0, 30)
    // camera.up.set(0, 0, 1)
    // camera.viewport = new THREE.Vector4(
    //     window.innerWidth / 2,
    //     window.innerHeight / 2,
    //     window.innerWidth,
    //     window.innerHeight
    // )

    const anoCamera = new PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )
    anoCamera.up.set(0, 0, 1)
    anoCamera.position.set(0, 0, 30)

    const renderer = new WebGLRenderer({
        alpha: true,
        premultipliedAlpha: false,
    })
    renderer.sortObjects = false
    renderer.setSize(window.innerWidth, window.innerHeight)
    //edl渲染会需要改变渲染不同画面和顺序，因此需手动clear
    renderer.autoClear = false
    renderer.setScissorTest(true)
    document.body.appendChild(renderer.domElement)

    window.aaa = () => {
        changeView = !changeView
    }

    //平移控制，是使用box盒的
    // const transformControl = new TransformControls(camera, renderer.domElement)
    // transformControl.addEventListener('dragging-changed', function (event) {
    //     controls.enabled = !event.value
    // })
    // scene.add(transformControl)

    store.viewer = {
        // camera,
        scene,
        renderer,
        // transformControl,
        anoCamera,
    }

    // const controls = new OrbitControls(camera, renderer.domElement)
    const anoControls = new IndoorControls(anoCamera, renderer.domElement)
    window.controls = anoControls
    // controls.enabled = false
    // anoControls.target.set(0, 0, 29)
    // anoControls.enabled = false
    // controls.enableDamping = false
    // anoControls.enableDamping = true
    // anoControls.rotateSpeed = -1
    // anoControls.dampingFactor = 0.2
    //跟随球
    const geo = new SphereGeometry(1, 64, 64)
    const mat = new MeshBasicMaterial({
        color: 0xffffff,
    })
    const sph = new Mesh(geo, mat)
    scene.add(sph)

    //固定位置球
    const sph2 = new Mesh(geo, mat)
    sph2.position.set(0, 0, 20)
    scene.add(sph2)
    store.sph = sph

    const geo3 = new SphereGeometry(10, 64, 64)
    const texture = new TextureLoader().load('./3633.jpg')
    const mat3 = new MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        // map: texture,
        wireframe: true,
    })
    const sph3 = new Mesh(geo3, mat3)
    sph3.rotateX(Math.PI / 2)
    sph3.position.set(0, 0, 30)
    scene.add(sph3)

    const handleMouseDown = (e) => {
        const [x, y] = [e.pageX, e.pageY]

        let nmouse = new THREE.Vector2(
            (x / renderer.domElement.clientWidth) * 2 - 1,
            -(y / renderer.domElement.clientHeight) * 2 + 1
        )
        const raycaster = new Raycaster(nmouse, anoCamera)
        const intersects = raycaster.intersectObject(sph3)
        // console.log('sph3 :>> ', nmouse)
        // console.log('sph3 :>> ', sph3)
        // console.log('sph3 :>> ', intersects)

        if (intersects.length > 0 && intersects[0].uv) {
            const uv = intersects[0].uv
            intersects[0].object.material.map.transformUv(uv)
            // console.log('uv :>> ', uv)
        }
        // console.log('nmouse :>> ', nmouse)
        // if (nmouse.x > 0 && nmouse.y > 0) {
        //     anoControls.enabled = false
        // } else {
        //     controls.enabled = false
        // }
    }
    // const handleMouseUp = (e) => {
    //     const [x, y] = [e.pageX, e.pageY]

    //     let nmouse = {
    //         x: (x / renderer.domElement.clientWidth) * 2 - 1,
    //         y: -(y / renderer.domElement.clientHeight) * 2 + 1,
    //     }
    //     console.log('nmouse :>> ', nmouse)
    //     // anoControls.enabled = true
    //     // controls.enabled = true
    // }
    // document.addEventListener('mousedown', handleMouseDown, false)
    // document.addEventListener('mouseup', handleMouseUp, false)

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

    const baseUrl = './huaweimesh.ply_converted/'

    let pickParams = {}
    const clock = new Clock()

    const handleMouseMove = (event) => {
        const [x, y] = [event.pageX, event.pageY]
        const { pointClouds, viewer } = store
        const { camera, renderer, anoCamera } = viewer
        let point
        let nmouse = {
            x: (x / renderer.domElement.clientWidth) * 2 - 1,
            y: -(y / renderer.domElement.clientHeight) * 2 + 1,
        }

        if (nmouse.x > 0 && nmouse.y > 0) {
            let anomouse = {
                x: (x / renderer.domElement.clientWidth) * 4 - 3,
                y: -(y / renderer.domElement.clientHeight) * 4 + 1,
            }
            // pickParams.x = x - renderer.domElement.clientWidth / 2
            // pickParams.y = renderer.domElement.clientHeight / 2 - y

            // console.log('anomouse :>> ', anomouse)
            // point = mouseRay(
            //     anomouse,
            //     x,
            //     y,
            //     pointClouds,
            //     renderer,
            //     camera,
            //     pickParams
            // )
        } else {
            // pickParams.x = x
            // pickParams.y = renderer.domElement.clientHeight - y
            point = mouseRay(
                nmouse,
                x,
                y,
                pointClouds,
                renderer,
                anoCamera,
                pickParams
            )
        }
        // const { sph } = store
        // if (point) {
        //     sph.position.copy(point.position)
        // }
    }

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

            // pco.material.pointSizeType = PointSizeType.ADAPTIVE

            // pco.material.pointColorType = 1
            // pco.material.opacity = 0.01
            // pco.material.pointOpacityType = 2
            // pco.material.color = new Color(0xff0000)
            // console.log('pco.material :>> ', pco.material.pointColorType)
            // console.log('pco.material :>> ', pco.material)
            // console.log('pco:>> ', pco)

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

            // generateClipBox(pco)
            // pco.material.clipMode = ClipMode.CLIP_OUTSIDE
        })
    update()

    function update(t) {
        requestAnimationFrame(update)

        // This is where most of the potree magic happens. It updates the visiblily of the octree nodes
        // based on the camera frustum and it triggers any loads/unloads which are necessary to keep the
        // number of visible points in check.
        renderer.clear()

        // controls.update()
        // console.log('clock.getDelta() :>> ', clock.getDelta())
        anoControls.update(clock.getDelta())

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

        //清空画布，并渲染背景（如果是纯色也可选择用renderer的clearcolor作为背景）
        renderer.clear()
        renderer.render(sceneBG, anoCamera)

        // renderer.setScissorTest(true)
        // renderer.setScissor(
        //     window.innerWidth / 2,
        //     window.innerHeight / 2,
        //     window.innerWidth,
        //     window.innerHeight
        // )

        const pco = pointClouds[0]
        if (pco) {
            pco.material.pointColorType = 0
            pco.material.opacity = 1
            pco.material.pointOpacityType = 2
            // pco.material.color = new Color(0xff0000)
        }
        if (changeView) {
            renderer.setViewport(
                window.innerWidth / 2,
                window.innerHeight / 2,
                window.innerWidth / 2,
                window.innerHeight / 2
            )
        } else {
            renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
        }
        // potree.updatePointClouds(pointClouds, camera, renderer)

        //渲染点云，可切换
        // if (isUseEdl) {
        //     edlRenderer.render(scenePC, camera)
        // } else {
        //     renderer.render(scenePC, camera)
        // }
        // sph2.material.color = new Color(0x00ffff)
        // renderer.render(scene, camera)

        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
        // renderer.setScissorTest(true)
        // renderer.setScissor(0, 0, window.innerWidth, window.innerHeight)
        //渲染一般物体（非点云）
        if (pco) {
            // pco.material.pointColorType = 1
            // pco.material.opacity = 0.01
            // pco.material.pointOpacityType = 2
            // pco.material.color = new Color(0xff0000)
        }
        potree.updatePointClouds(pointClouds, anoCamera, renderer)

        renderer.render(scenePC, anoCamera)
        sph2.material.color = new Color(0xffffff)

        renderer.render(scene, anoCamera)
        // }
    }
}

const mapInit = () => {
    var gps = [121.4651050712, 31.22595475606]
    AMap.convertFrom(gps, 'gps', function (status, ret) {
        if (ret.info === 'ok') {
            const lng = ret.locations // Array.<LngLat>

            console.log('object :>> ', lng[0])
            const map = new AMap.Map('container', {
                zoom: 11, //级别
                center: [lng[0].R, lng[0].Q], //中心点坐标
                viewMode: '3D', //使用3D视图
            })
            map.setZoom(16)

            Axios.get('./pos.txt').then((res) => {
                const split = res.data.split('\n')
                // console.log('split :>> ', split)
                const result = []
                split.forEach((val) => {
                    const each = val.split(' ')
                    result.push([Number(each[7]), Number(each[6])])
                })
                // console.log('result :>> ', result)
                const beforePath = []
                result.forEach((val) =>
                    beforePath.push(new AMap.LngLat(...val))
                )

                AMap.convertFrom(
                    beforePath,
                    'gps',
                    function (status, response) {
                        if (response.info === 'ok') {
                            const lnglats = response.locations // Array.<LngLat>
                            const paths = lnglats.map((val) => {
                                return [val.R, val.Q]
                            })
                            console.log('lnglats :>> ', lnglats)
                            console.log('path :>> ', paths)
                            var polyline = new AMap.Polyline({
                                path: paths,
                                borderWeight: 2, // 线条宽度，默认为 1
                                strokeColor: 'red', // 线条颜色
                                lineJoin: 'round', // 折线拐点连接处样式
                            })
                            map.add(polyline)
                        }
                    }
                )
                console.log('before :>> ')

                // 将折线添加至地图实例
                // var polyline = new AMap.Polyline({
                //     path: beforePath,
                //     borderWeight: 2, // 线条宽度，默认为 1
                //     strokeColor: 'red', // 线条颜色
                //     lineJoin: 'round', // 折线拐点连接处样式
                // })
                // map.add(polyline)
            })
        }
    })
}

export default init
export { mapInit }
