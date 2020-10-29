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
    Float32BufferAttribute,
} from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const materialExample = () => {
    const camera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    )
    camera.position.z = 1000
    const scene = new Scene()
    scene.background = new Color(0x0)

    const container = document.createElement('div')
    document.body.appendChild(container)
    const renderer = new WebGLRenderer({})
    renderer.outputEncoding = sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    var helper = new THREE.GridHelper(1000, 40, 0x303030, 0x303030)
    helper.position.y = -75
    scene.add(helper)

    const materials = []
    const objects = []
    // Materials

    const generateTexture = () => {
        var canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256

        var context = canvas.getContext('2d')
        var image = context.getImageData(0, 0, 256, 256)

        var x = 0,
            y = 0

        for (var i = 0, j = 0, l = image.data.length; i < l; i += 4, j++) {
            x = j % 256
            y = x == 0 ? y + 1 : y

            image.data[i] = 255
            image.data[i + 1] = 255
            image.data[i + 2] = 255
            image.data[i + 3] = Math.floor(x ^ y)
        }

        context.putImageData(image, 0, 0)

        return canvas
    }

    var texture = new THREE.Texture(generateTexture())
    texture.needsUpdate = true

    materials.push(new THREE.MeshBasicMaterial({}))

    materials.push(new THREE.MeshLambertMaterial({ color: 0xdddddd }))
    materials.push(
        new THREE.MeshPhongMaterial({
            color: 0xdddddd,
            // specular: 0x009900,
            // shininess: 30,
            // flatShading: true,
        })
    )
    materials.push(new THREE.MeshNormalMaterial())
    materials.push(
        new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            blending: THREE.AdditiveBlending,
        })
    )
    materials.push(new THREE.MeshPhysicalMaterial({ color: 0xdddddd }))
    materials.push(
        new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            // specular: 0x009900,
            // shininess: 30,
            // map: texture,
            // transparent: true,
        })
    )
    materials.push(new THREE.MeshNormalMaterial({ flatShading: true }))
    materials.push(
        new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true })
    )
    materials.push(
        new THREE.MeshLambertMaterial({ color: 0x666666, emissive: 0xff0000 })
    )
    materials.push(
        new THREE.MeshPhongMaterial({
            color: 0x000000,
            specular: 0x666666,
            emissive: 0xff0000,
            shininess: 10,
            opacity: 0.9,
            transparent: true,
        })
    )
    materials.push(new THREE.MeshDepthMaterial())

    materials.push(
        new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    )

    materials.push(
        new THREE.MeshLambertMaterial({ map: texture, transparent: true })
    )

    // Spheres geometry

    var geometry = new THREE.SphereBufferGeometry(70, 32, 16)

    const generateVertexColors = (geometry) => {
        var positionAttribute = geometry.attributes.position

        var colors = []
        var color = new Color()

        for (var i = 0, il = positionAttribute.count; i < il; i++) {
            color.setHSL((i / il) * Math.random(), 0.5, 0.5)
            colors.push(color.r, color.g, color.b)
        }

        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    }

    const basGeo = new THREE.SphereBufferGeometry(70, 32, 16)
    generateVertexColors(basGeo)

    const addMesh = (geometry, material) => {
        var mesh = new THREE.Mesh(geometry, material)

        mesh.position.x = (objects.length % 4) * 200 - 400
        mesh.position.z = Math.floor(objects.length / 4) * 200 - 200

        mesh.rotation.x = Math.random() * 200 - 100
        mesh.rotation.y = Math.random() * 200 - 100
        mesh.rotation.z = Math.random() * 200 - 100

        objects.push(mesh)

        scene.add(mesh)
    }

    addMesh(basGeo, materials[0])

    for (var i = 1, l = materials.length; i < l; i++) {
        addMesh(geometry, materials[i])
    }

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.125)

    directionalLight.position.x = Math.random() - 0.5
    directionalLight.position.y = Math.random() - 0.5
    directionalLight.position.z = Math.random() - 0.5
    directionalLight.position.normalize()

    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    scene.add(pointLight)

    pointLight.add(
        new THREE.Mesh(
            new THREE.SphereBufferGeometry(4, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        )
    )

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
        var timer = 0.0001 * Date.now()
        controls.update()
        for (var i = 0, l = objects.length; i < l; i++) {
            var object = objects[i]

            object.rotation.x += 0.01
            object.rotation.y += 0.005
        }

        pointLight.position.x = Math.sin(timer * 7) * 300
        pointLight.position.y = Math.cos(timer * 5) * 400
        pointLight.position.z = Math.cos(timer * 3) * 300
        renderer.render(scene, camera)
    }
    animate()
}

export default materialExample
