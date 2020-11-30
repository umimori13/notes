import * as THREE from 'three'
import { EventDispatcher } from 'three'

export class MeasuringTool extends EventDispatcher {
    constructor(PCOViewer) {
        super()

        this.scene = new THREE.Scene()
        this.scene.name = 'scene_measurement'

        this.renderer = PCOViewer.renderer
        this.camera = PCOViewer.camera
        PCOViewer.inputHandler.registerInteractiveScene(this.scene)
    }
}
