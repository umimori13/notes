import * as THREE from 'three'
import { motionBlurShader } from './motionBlurShader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { DepthTexture, Matrix4, Vector3, WebGLRenderTarget } from 'three'

let container
let camera, scene, renderer
let cube, controls

const initThree = () => {
    container = document.createElement('div')
    document.body.appendChild(container)

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
    )
    camera.position.z = 5

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0.5, 1, 0.25)
    scene.add(light)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)

    window.addEventListener('resize', onWindowResize, false)

    // EFFECTS
    const composer = new EffectComposer(renderer)

    // define a render target with a depthbuffer
    const target = new WebGLRenderTarget(window.innerWidth, window.innerHeight)
    target.depthBuffer = true
    target.depthTexture = new DepthTexture()

    // add a motion blur pass
    const motionPass = new ShaderPass(motionBlurShader)
    motionPass.renderToScreen = false
    composer.addPass(motionPass)

    // define variables used by the motion blur pass
    let previousMatrixWorldInverse = new Matrix4()
    let previousProjectionMatrix = new Matrix4()
    let previousCameraPosition = new Vector3()
    let tmpMatrix = new Matrix4()
    let lastTimestamp = 0
    const render = (timestamp, frame) => {
        // render scene and depthbuffer to the render target

        renderer.setRenderTarget(target)
        renderer.render(scene, camera)

        let delta = timestamp - lastTimestamp
        lastTimestamp = timestamp
        // update motion blur shader uniforms
        motionPass.material.uniforms.tColor.value = target.texture
        motionPass.material.uniforms.tDepth.value = target.depthTexture
        motionPass.material.uniforms.velocityFactor.value = 1
        motionPass.material.uniforms.delta.value = delta
        // tricky part to compute the clip-to-world and world-to-clip matrices
        motionPass.material.uniforms.clipToWorldMatrix.value
            .getInverse(camera.matrixWorldInverse)
            .multiply(tmpMatrix.getInverse(camera.projectionMatrix))
        motionPass.material.uniforms.previousWorldToClipMatrix.value.copy(
            previousProjectionMatrix.multiply(previousMatrixWorldInverse)
        )
        motionPass.material.uniforms.cameraMove.value
            .copy(camera.position)
            .sub(previousCameraPosition)

        // render the postprocessing passes
        composer.render(delta)

        // save some values for the next render pass
        previousMatrixWorldInverse.copy(camera.matrixWorldInverse)
        previousProjectionMatrix.copy(camera.projectionMatrix)
        previousCameraPosition.copy(camera.position)

        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
    }

    const animate = () => {
        renderer.setAnimationLoop(render)

        // // if using RequestAnimation()
        // requestAnimationFrame(animate)
        // render()
    }
    animate()
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    controls.update()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

export { initThree }
