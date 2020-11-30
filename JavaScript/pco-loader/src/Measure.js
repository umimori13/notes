import * as THREE from 'three'

export class Measure extends THREE.Object3D {
    constructor() {
        super()
        this.constructor.counter =
            this.constructor.counter === undefined
                ? 0
                : this.constructor.counter + 1

        this.name = 'Measure_' + this.constructor.counter

        this.sphereGeometry = new THREE.SphereGeometry(0.4, 10, 10)
        this.color = new THREE.Color(0xff0000)

        this.points = []
        this.spheres = []
        this.edges = []
        this.sphereLabels = []
        this.edgeLabels = []
        this.angleLabels = []
        this.coordinateLabels = []
    }
}
