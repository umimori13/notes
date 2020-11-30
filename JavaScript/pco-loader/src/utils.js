import * as THREE from 'three'
import { PointCloudOctree, Potree } from '@pnext/three-loader'

export default class Utils {
    static mouseToRay(mouse, camera, width, height) {
        let normalizedMouse = {
            x: (mouse.x / width) * 2 - 1,
            y: -(mouse.y / height) * 2 + 1,
        }

        let vector = new THREE.Vector3(
            normalizedMouse.x,
            normalizedMouse.y,
            0.5
        )
        let origin = camera.position.clone()
        vector.unproject(camera)
        let direction = new THREE.Vector3()
            .subVectors(vector, origin)
            .normalize()

        let ray = new THREE.Ray(origin, direction)

        return ray
    }

    static getMousePointCloudIntersection(
        mouse,
        camera,
        renderer,
        pointclouds,
        params = {}
    ) {
        let nmouse = {
            x: (mouse.x / renderer.domElement.clientWidth) * 2 - 1,
            y: -(mouse.y / renderer.domElement.clientHeight) * 2 + 1,
        }

        let pickParams = {}

        if (params.pickClipped) {
            pickParams.pickClipped = params.pickClipped
        }

        pickParams.x = mouse.x
        pickParams.y = renderer.domElement.clientHeight - mouse.y

        let raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(nmouse, camera)
        let ray = raycaster.ray

        let selectedPointcloud = null
        let closestDistance = Infinity
        let closestIntersection = null
        let closestPoint = null

        const point = Potree.pick(
            pointclouds,
            renderer,
            camera,
            ray,
            pickParams
        )

        if (!point) {
            return null
        }

        let distance = camera.position.distanceTo(point.position)

        if (distance < closestDistance) {
            closestDistance = distance
            // selectedPointcloud = pointcloud
            closestIntersection = point.position
            closestPoint = point
        }

        if (point) {
            return {
                location: closestIntersection,
                distance: closestDistance,
                // pointcloud: selectedPointcloud,
                point: closestPoint,
            }
        } else {
            return null
        }
    }
}
