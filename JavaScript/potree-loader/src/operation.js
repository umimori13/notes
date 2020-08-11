import { PointCloudOctree, Potree } from '@pnext/three-loader'
import store from './store'
import {} from 'three-full'
import { Box3Helper, Matrix4, Mesh, Raycaster, Box3, Vector3 } from 'three'
import IClipBox from './IClipBox'
import * as THREE from 'three'

const handleMouseDown = (event) => {
    const [x, y] = [event.pageX, event.pageY]
    const { pointClouds, viewer } = store
    const { camera, renderer, scene } = viewer
    const point = mouseRay(x, y, pointClouds, renderer, camera)
    if (point) {
        // console.log('point :>> ', point)
        // const box = point.pointCloud.getBoundingBoxWorld()
        const testBox = new Box3()
        const helper = new Box3Helper(
            point.pointCloud.getBoundingBoxWorld(),
            0xffff00
        )
        // const matrix = point.pointCloud.matrixWorld.clone()
        // matrix.elements[14] = 0
        // matrix.elements[13] = 0
        // matrix.elements[12] = 0
        // const inverMat = matrix.clone()
        // console.log('object :>> ', inverMat)
        // inverMat.getInverse(inverMat)
        // const pos = point.pointCloud.position.clone()
        // box.min.z = -10

        // console.log('point :>> ', helper)
        // scene.add(helper)
        // console.log('scene :>> ', scene)
    }
}

const handleMouseMove = (event) => {
    const [x, y] = [event.pageX, event.pageY]
    const { pointClouds, viewer } = store
    const { camera, renderer } = viewer
    const point = mouseRay(x, y, pointClouds, renderer, camera)
    const { sph } = store
    if (point) {
        sph.position.copy(point.position)
    }
}

const mouseRay = (x, y, arr, renderer, camera, params = {}) => {
    let nmouse = {
        x: (x / renderer.domElement.clientWidth) * 2 - 1,
        y: -(y / renderer.domElement.clientHeight) * 2 + 1,
    }
    let pickParams = {}

    if (params.pickClipped) {
        pickParams.pickClipped = params.pickClipped
    }

    pickParams.x = x
    pickParams.y = renderer.domElement.clientHeight - y

    let raycaster = new Raycaster()
    raycaster.setFromCamera(nmouse, camera)
    let ray = raycaster.ray
    const pointCloud = Potree.pick(arr, renderer, camera, ray, pickParams)
    // if (pointCloud) {
    //     pointCloud.position.x = 255
    // }

    // console.log('object :>> ', arr, renderer, camera, ray, pickParams)
    const point = pointCloud ?? null
    // console.log('object :>> ', point)

    // point.position
    return point
}

export { handleMouseMove, handleMouseDown }
