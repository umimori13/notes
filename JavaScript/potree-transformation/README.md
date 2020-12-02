# TransformationTool

This tool is separate from [Potree](http://potree.org) for transformation, rotate, scale at the same time.

## Guide

```Javascript

import { InputHandler } from './inputHandler'
import { TransformationTool } from './TransformationTool'

let transform
...

function init(){

    ...
    renderer.autoClear = false

    const handler = new InputHandler(camera, renderer.domElement)
    handler.setScene(scene)

    transform = new TransformationTool(camera, renderer, handler)
    ...

}
function render(){
    ...

    //after renderer.render(scene, camera)
    transform.render()

    ...
}

```

then the object need compute the boundingbox and it should have it have the evnetlistener

```Javascript

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)

    geometry.computeBoundingBox()
    cube.boundingBox = geometry.boundingBox

    cube.addEventListener('select', () => {})
    cube.addEventListener('deselect', () => {})
```
