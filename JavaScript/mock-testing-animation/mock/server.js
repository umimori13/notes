const WebSocket = require('ws')
const fs = require('fs')

function readFile(num) {
    let data
    try {
        data = fs.readFileSync(`mock/data/${num}.csv`, {
            encoding: 'ascii',
        })
        // data = data.split('\r\n').map((val) => {
        //     const split = val.split(',')
        //     if (split.length < 4) return
        //     else return split
        // })
    } catch (error) {}
    return data
}

const wss = new WebSocket.Server({ port: 9090 })
console.log('WebSocket sever is listening at port ws://localhost:9090/')

let intervalID
let lastTime = 0,
    curTime = Date.now()
const readBuffer = [],
    sendBuffer = []
let count = 1
let index = 0
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
        const fps = 100 / 6
        count = 0
        if (message === 'Please give me data!') {
            while(count <= 1000){
                index = index <=1000 ? index+1 : 1
                const element = readFile(index)
                // console.log('element :>> ', element);
                // readBuffer.push(element)
                curTime = Date.now()
                // if (curTime - lastTime>fps ){
                //     lastTime = curTime
                //     ws.send(element)
                //     ws.send(index)
                // }
                ws.send(element)
                ws.send(index)
                count+=1

            }
            
            // intervalID = setInterval(() => {
            //     if (readBuffer.length) {
            //         ws.send(readBuffer.shift())
            //         ws.send(count)
            //         count++
            //     } else {
            //         ws.send('Done!')
            //         clearInterval(intervalID)
            //     }
            // }, fps)
        }
    })

    // ws.send('something')
})
