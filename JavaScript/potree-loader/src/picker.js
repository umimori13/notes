import { PointCloudOctree, Potree } from '@pnext/three-loader'
import { Vector2 } from 'three-full'
import store from './store'

const handleMouseMove = (event) => {
    const mouse = new Vector2()
    const [x, y] = [event.pageX, event.pageY]
    const { camera } = store.viewer
    mouseRay(x, y, arr, camera)
}

const mouseRay = (x, y, arr, camera) => {
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
}

// export default ;
