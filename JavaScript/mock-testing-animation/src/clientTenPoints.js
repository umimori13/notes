import state from "./state";
import {
    BufferAttribute,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
} from "three";
import Worker from "./readTenPoints.worker.js";
import WorkerCompare from "./compareTenPoints.worker";

const clientGet = (url) => {
    const ws = new WebSocket(url);

    const readTenPointsWorker = new Worker();
    const compareTenPointsWorker = new WorkerCompare();
    let curtime = Date.now(),
        lastTime = Date.now(),
        frame = 0,
        lastFreme = 0,
        total = 0,
        frameCount = 0;

        // compareTenPointsWorker.onmessage = function(event){
        //     // readTenPointsWorker.postMessage({
        //     //     data: event.data,
        //     //     id: 1,
        //     // });

        // }
    
        const pointsArr = []
        compareTenPointsWorker.onmessage = function (event) {
        // console.log('event.data :>> ', event.data)
        {

            
            let MAX_POINTS = 5000000;
            frame++;
            curtime = Date.now();
            if (curtime - lastTime >= 1000) {
                lastTime = curtime;
                console.log("frame :>> ", frame - lastFreme);
                total = total + frame - lastFreme;
                lastFreme = frame;
                frameCount++;
                console.log("fps :>> ", total / frameCount);
                // console.log('frameCount :>> ', frameCount)
                // console.log('frameCount :>> ', total)
            }
            if (pointsArr.length>=10) {
                const firstPoint = pointsArr.shift()
                const points = firstPoint;

                const buffer = event.data.buffer;
                const intensity = event.data.intensity;

                // event.data.intensity.some((val, idx) => {
                //     if (val) {
                //         // vertices.push(val[0], val[1], val[2])
                //         if (idx >= MAX_POINTS) return true

                //         positions[idx * 3] = buffer[idx * 3]
                //         positions[idx * 3 + 1] = buffer[idx * 3 + 1]
                //         positions[idx * 3 + 2] = buffer[idx * 3 + 2]
                //         // const a = Math.round(val * 1.1)
                //         // const b = Math.round(val * 1.1)
                //         // color.setStyle(`rgb(${a},${b},200)`)
                //         colors[idx * 3] = color.r
                //         colors[idx * 3 + 1] = color.g
                //         colors[idx * 3 + 2] = color.b
                //     }
                // })

                // itemSize = 3 because there are 3 values (components) per vertex
                const geometry = new BufferGeometry();
                geometry.setAttribute("position", new BufferAttribute(buffer, 3));
                geometry.setAttribute("color", new BufferAttribute(intensity, 3));
                geometry.computeBoundingSphere();

                scene.remove(points);
                points.geometry.dispose();
                // points.dispose()
                const mat = points.material;
                const newPoints = new Points(geometry, mat);
                // newPoints.position.set(6, 15, 0)
                // newPoints.rotation.set(0, -0.06, -3.02)
                // newPoints.scale.set(0.1, 0.1, 0.1)
                state.points = newPoints;
                scene.add(newPoints);
                pointsArr.push(newPoints)
            } else {
                const { scene } = state;
                const geometry = new BufferGeometry();
                // const colors = new Float32Array(MAX_POINTS * 3)
                // const color = new Color()
                // // create a simple square shape. We duplicate the top left and bottom right
                // // vertices because each vertex needs to appear once per triangle.
                // const vertices = []
                const positions = event.data.buffer;

                // event.data.intensity.forEach((val, idx) => {
                //     if (val) {
                //         // vertices.push(val[0], val[1], val[2])
                //         const a = Math.round(val * 1.1)
                //         const b = Math.round(val * 1.1)
                //         color.setStyle(`rgb(${a},${b},200)`)
                //         colors[idx * 3] = color.r
                //         colors[idx * 3 + 1] = color.g
                //         colors[idx * 3 + 2] = color.b
                //     }
                // })
                // itemSize = 3 because there are 3 values (components) per vertex
                geometry.setAttribute("position", new BufferAttribute(positions, 3));
                geometry.setAttribute(
                    "color",
                    new BufferAttribute(event.data.intensity, 3)
                );
                geometry.computeBoundingSphere();

                const material = new PointsMaterial({
                    size: 0.11,
                    vertexColors: true,
                });

                const points = new Points(geometry, material);
                // points.position.set(6, 15, 0)
                // points.rotation.set(0, -0.06, -3.02)
                // points.scale.set(0.1, 0.1, 0.1)
                state.points = points;
                scene.add(points);
                pointsArr.push(points)
                // console.log('data :>> ', geometry)
                // console.log('data :>> ', points)
            }
        }
    };

    ws.onopen = function (evt) {
        console.log("Connection open ...");
        ws.send("Hello WebSockets!");
        setTimeout(() => ws.send("Please give me data!"), 1000);
    };
    let count = 0;
    // let tenPoints = []
    ws.onmessage = function (evt) {
        // console.log("evt :>> ", evt);
        if (evt.data === "Done!") {
            ws.close();
        } else {
            if (evt.data.length < 5) {
                console.log('frame :>> ', evt.data)
            } else {
                // worker cannot change the datas outside
                // if (tenPoints.length<10){
                //     tenPoints.push(evt.data)
                // }else{
                //     tenPoints.shift()
                //     tenPoints.push(evt.data)
                // }
                // console.log('evt.data :>> ', evt.data);
                compareTenPointsWorker.postMessage({
                    // newData:evt.data,
                    data: evt.data,
                    id: count,
                });
                // ws.close()
            }
        }

        count++;
    };

    // ws.onmessage = function (evt) {
    //     // console.log('Received Message: ' + evt.data)

    //     if (evt.data === 'Done!') {
    //         ws.close()
    //     } else {
    //         if (evt.data.length < 5) {
    //             console.log('frame :>> ', evt.data)
    //         } else {
    //             let MAX_POINTS = 5000000
    //             if (state.points) {
    //                 const points = state.points
    //                 const data = evt.data.split('\r\n').map((val) => {
    //                     const split = val.split(',')
    //                     if (split.length < 4) return
    //                     else return split
    //                 })

    //                 const colors = points.geometry.attributes.color.array
    //                 const color = new Color()
    //                 // create a simple square shape. We duplicate the top left and bottom right
    //                 // vertices because each vertex needs to appear once per triangle.
    //                 const vertices = []

    //                 const positions = points.geometry.attributes.position.array

    //                 data.some((val, idx) => {
    //                     if (val) {
    //                         // vertices.push(val[0], val[1], val[2])
    //                         if (idx >= MAX_POINTS) return true
    //                         positions[idx * 3] = val[0]
    //                         positions[idx * 3 + 1] = val[1]
    //                         positions[idx * 3 + 2] = val[2]
    //                         const a = Math.round(val[3] * 1.1)
    //                         const b = Math.round(val[3] * 1.1)
    //                         color.setStyle(`rgb(${a},${b},200)`)
    //                         colors[idx * 3] = color.r
    //                         colors[idx * 3 + 1] = color.g
    //                         colors[idx * 3 + 2] = color.b
    //                     }
    //                 })
    //                 // itemSize = 3 because there are 3 values (components) per vertex

    //                 points.geometry.setDrawRange(0, data.length)
    //                 points.geometry.attributes.position.needsUpdate = true
    //                 points.geometry.attributes.color.needsUpdate = true
    //                 points.geometry.computeBoundingSphere()
    //             } else {
    //                 const data = evt.data.split('\r\n').map((val) => {
    //                     const split = val.split(',')
    //                     if (split.length < 4) return
    //                     else return split
    //                 })
    //                 const { scene } = state
    //                 const geometry = new BufferGeometry()
    //                 const colors = new Float32Array(MAX_POINTS * 3)
    //                 const color = new Color()
    //                 // create a simple square shape. We duplicate the top left and bottom right
    //                 // vertices because each vertex needs to appear once per triangle.
    //                 const vertices = []
    //                 const positions = new Float32Array(MAX_POINTS * 3)

    //                 data.forEach((val, idx) => {
    //                     if (val) {
    //                         // vertices.push(val[0], val[1], val[2])
    //                         positions[idx * 3] = val[0]
    //                         positions[idx * 3 + 1] = val[1]
    //                         positions[idx * 3 + 2] = val[2]
    //                         const a = Math.round(val[3] * 1.1)
    //                         const b = Math.round(val[3] * 1.1)
    //                         color.setStyle(`rgb(${a},${b},200)`)
    //                         colors[idx * 3] = color.r
    //                         colors[idx * 3 + 1] = color.g
    //                         colors[idx * 3 + 2] = color.b
    //                     }
    //                 })
    //                 // itemSize = 3 because there are 3 values (components) per vertex
    //                 geometry.setAttribute(
    //                     'position',
    //                     new BufferAttribute(positions, 3)
    //                 )
    //                 geometry.setAttribute(
    //                     'color',
    //                     new BufferAttribute(colors, 3)
    //                 )
    //                 geometry.computeBoundingSphere()

    //                 const material = new PointsMaterial({
    //                     size: 0.38,
    //                     vertexColors: true,
    //                 })

    //                 const points = new Points(geometry, material)
    //                 points.position.set(6, 15, 0)
    //                 points.rotation.set(0, -0.06, -3.02)
    //                 points.scale.set(0.1, 0.1, 0.1)
    //                 state.points = points
    //                 scene.add(points)
    //                 console.log('data :>> ', geometry)
    //                 console.log('data :>> ', points)
    //             }
    //         }
    //     }
    // }

    ws.onclose = function (evt) {
        console.log("closed evt :>> ", evt);
        console.log("Connection closed.");
    };
    console.log("theClient :>> ", ws);
};
export default clientGet;
