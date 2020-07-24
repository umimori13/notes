const fetch = require('node-fetch')
async function b(url) {
    let b = []
    let d
    const c = await fetch(url).then((data) => {
        return data.text()
    })
    const e = await function(){
        console.log('e :>> ', 111);
    }
    console.log('e :>> ', e);
    // c.then((data)=>{
    //     console.log('data :>> ', data);
    // })
    console.log('c :>> ', c)
    // await new Promise((resolve)=>{

    // })

    return c
}

const a = 'http://127.0.0.1:8080/test.txt'
console.log('a :>> ', a)
console.log(
    'after a :>> ',
    b(a).then((data) => {
        console.log('getData :>> ', data)
    })
)

// fetch(a).then((data) => {
//     console.log('data :>>.catch((e)) ', data)
// })
