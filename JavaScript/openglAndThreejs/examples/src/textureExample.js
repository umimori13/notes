import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    MeshBasicMaterial,
    AmbientLight,
    Color,
    MeshPhongMaterial,
    HemisphereLight,
    sRGBEncoding,
    VertexColors,
    TextureLoader,
    DoubleSide,
    MeshLambertMaterial,
    NearestFilter,
    LinearFilter,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as dat from 'dat.gui'

const textureExample = () => {
    var onClickPosition = new THREE.Vector2()
    var mouse = new THREE.Vector2()
    var raycaster = new THREE.Raycaster()

    var CanvasTexture = function (parentTexture) {
        this._canvas = document.createElement('canvas')
        this._canvas.width = this._canvas.height = 1024
        this._context2D = this._canvas.getContext('2d')

        if (parentTexture) {
            this._parentTexture.push(parentTexture)
            parentTexture.image = this._canvas
        }

        var that = this
        this._background = document.createElement('img')
        this._background.addEventListener(
            'load',
            function () {
                that._canvas.width = that._background.naturalWidth
                that._canvas.height = that._background.naturalHeight

                that._crossRadius = Math.ceil(
                    Math.min(that._canvas.width, that._canvas.height / 30)
                )
                that._crossMax = Math.ceil(0.70710678 * that._crossRadius)
                that._crossMin = Math.ceil(that._crossMax / 10)
                that._crossThickness = Math.ceil(that._crossMax / 10)

                that._draw()
            },
            false
        )
        this._background.crossOrigin = ''
        this._background.src = './wall.jpg'

        this._draw()
    }

    CanvasTexture.prototype = {
        constructor: CanvasTexture,

        _canvas: null,
        _context2D: null,
        _xCross: 0,
        _yCross: 0,

        _crossRadius: 57,
        _crossMax: 40,
        _crossMin: 4,
        _crossThickness: 4,

        _parentTexture: [],

        addParent: function (parentTexture) {
            if (this._parentTexture.indexOf(parentTexture) === -1) {
                this._parentTexture.push(parentTexture)
                parentTexture.image = this._canvas
            }
        },

        setCrossPosition: function (x, y) {
            this._xCross = x * this._canvas.width
            this._yCross = y * this._canvas.height

            this._draw()
        },

        _draw: function () {
            if (!this._context2D) return

            this._context2D.clearRect(
                0,
                0,
                this._canvas.width,
                this._canvas.height
            )

            // Background.
            this._context2D.drawImage(this._background, 0, 0)

            // Yellow cross.
            this._context2D.lineWidth = this._crossThickness * 3
            this._context2D.strokeStyle = '#FFFF00'

            this._context2D.beginPath()
            this._context2D.moveTo(
                this._xCross - this._crossMax - 2,
                this._yCross - this._crossMax - 2
            )
            this._context2D.lineTo(
                this._xCross - this._crossMin,
                this._yCross - this._crossMin
            )

            this._context2D.moveTo(
                this._xCross + this._crossMin,
                this._yCross + this._crossMin
            )
            this._context2D.lineTo(
                this._xCross + this._crossMax + 2,
                this._yCross + this._crossMax + 2
            )

            this._context2D.moveTo(
                this._xCross - this._crossMax - 2,
                this._yCross + this._crossMax + 2
            )
            this._context2D.lineTo(
                this._xCross - this._crossMin,
                this._yCross + this._crossMin
            )

            this._context2D.moveTo(
                this._xCross + this._crossMin,
                this._yCross - this._crossMin
            )
            this._context2D.lineTo(
                this._xCross + this._crossMax + 2,
                this._yCross - this._crossMax - 2
            )

            this._context2D.stroke()

            for (var i = 0; i < this._parentTexture.length; i++) {
                this._parentTexture[i].needsUpdate = true
            }
        },
    }

    const camera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        100000
    )
    camera.position.z = 1000
    const planeCamera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    )
    planeCamera.position.set(0, 0, 100)
    const scene = new Scene()
    // scene.background = new Color(0x0)
    const planeScene = new Scene()

    const container = document.createElement('div')
    document.body.appendChild(container)
    const renderer = new WebGLRenderer({})
    renderer.outputEncoding = sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.autoClear = false
    container.appendChild(renderer.domElement)

    const cubeTexture = new THREE.Texture(
        undefined,
        THREE.UVMapping,
        THREE.RepeatWrapping,
        THREE.RepeatWrapping
    )
    const canvas = new CanvasTexture(cubeTexture)
    const texture = new TextureLoader().load('./wall.jpg')
    const texture2 = new TextureLoader().load('./awesomeface.png')
    window.texture2 = texture2
    const geo = new BoxGeometry(1000, 1000, 100)
    const mat = new MeshLambertMaterial({
        map: cubeTexture,
        transparent: true,
        opacity: 0.5,
    })
    const cube = new Mesh(geo, mat)
    scene.add(cube)

    const geo2 = new BoxGeometry(10000, 10000, 100)
    const mat2 = new MeshLambertMaterial({
        map: cubeTexture,
        transparent: true,
        opacity: 0.5,
    })
    const cube2 = new Mesh(geo2, mat2)
    scene.add(cube2)
    cube2.position.set(0, 0, -1000)

    const planeTexture = new THREE.Texture(
        undefined,
        THREE.UVMapping,
        THREE.MirroredRepeatWrapping,
        THREE.MirroredRepeatWrapping
    )
    planeTexture.minFilter = NearestFilter
    canvas.addParent(planeTexture)
    var planeMaterial = new THREE.MeshBasicMaterial({
        map: planeTexture,
        side: DoubleSide,
        depthTest: false,
    })
    var planeGeometry = new THREE.PlaneBufferGeometry(25, 25, 1, 1)
    // var uvs = planeGeometry.attributes.uv.array
    // // Set a specific texture mapping.
    // for (var i = 0; i < uvs.length; i++) {
    //     uvs[i] *= 2
    // }
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.x = 50
    plane.position.y = 2
    plane.position.z = 0
    planeScene.add(plane)

    window.cube = cube
    window.BoxGeometry = BoxGeometry

    const amb = new AmbientLight(0x999999)
    scene.add(amb)

    const planeChangeToNearest = () => {
        planeTexture.minFilter = NearestFilter
        planeTexture.needsUpdate = true
    }
    const planeChangeToLinear = () => {
        planeTexture.minFilter = LinearFilter
        planeTexture.needsUpdate = true
    }

    const cubeChangeToNearest = () => {
        cubeTexture.minFilter = NearestFilter
        cubeTexture.needsUpdate = true
    }
    const cubeChangeToLinear = () => {
        cubeTexture.minFilter = LinearFilter
        cubeTexture.needsUpdate = true
    }

    const cubeMagChangeToNearest = () => {
        cubeTexture.magFilter = NearestFilter
        cubeTexture.needsUpdate = true
    }
    const cubeMagChangeToLinear = () => {
        cubeTexture.magFilter = LinearFilter
        cubeTexture.needsUpdate = true
    }

    const setting = {
        planeChangeToNearest,
        planeChangeToLinear,
        cubeMagChangeToNearest,
        cubeMagChangeToLinear,
        cubeChangeToNearest,
        cubeChangeToLinear,
    }
    const gui = new dat.GUI({})
    gui.add(setting, 'planeChangeToNearest')
    gui.add(setting, 'planeChangeToLinear')
    gui.add(setting, 'cubeMagChangeToNearest')
    gui.add(setting, 'cubeMagChangeToLinear')
    gui.add(setting, 'cubeChangeToNearest')
    gui.add(setting, 'cubeChangeToLinear')

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)

    // scene.add(new HemisphereLight(0x443333, 0x111122))

    document.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const animate = () => {
        requestAnimationFrame(animate)
        renderer.clear()
        controls.update()
        renderer.render(planeScene, planeCamera)
        renderer.render(scene, camera)
    }
    animate()
    container.addEventListener('mousemove', onMouseMove, false)

    function onMouseMove(evt) {
        evt.preventDefault()

        var array = getMousePosition(container, evt.clientX, evt.clientY)
        onClickPosition.fromArray(array)

        var intersects = getIntersects(onClickPosition, scene.children)

        if (intersects.length > 0 && intersects[0].uv) {
            var uv = intersects[0].uv
            intersects[0].object.material.map.transformUv(uv)
            canvas.setCrossPosition(uv.x, uv.y)
        }
    }

    var getMousePosition = function (dom, x, y) {
        var rect = dom.getBoundingClientRect()
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height]
    }

    var getIntersects = function (point, objects) {
        mouse.set(point.x * 2 - 1, -(point.y * 2) + 1)

        raycaster.setFromCamera(mouse, camera)

        return raycaster.intersectObjects(objects)
    }
}

export default textureExample
