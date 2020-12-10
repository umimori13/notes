let express = require('express') //引入express
let Mock = require('mockjs') //引入mock

const fs = require('fs')

function readFile(num) {
    let data
    try {
        data = fs.readFileSync(`mock/data/${num}.csv`, {
            encoding: 'ascii',
        })
    } catch (error) {}
    return data
}

let app = express() //实例化express
let count = 1

app.use('/mode2/DataOne', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, GET, POST, DELETE, OPTIONS'
    )
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    // res.json(
    //     Mock.mock({
    //         status: 200,
    //         'dataSource|1-9': [
    //             {
    //                 'key|+1': 1,
    //                 'mockTitle|1': ['肆无忌惮'],
    //                 'mockContent|1': [
    //                     '角色精湛主题略荒诞',
    //                     '理由太短 是让人不安',
    //                     '疑信参半 却无比期盼',
    //                     '你的惯犯 圆满',
    //                     '别让纠缠 显得 孤单',
    //                 ],
    //                 'mockAction|1': ['下载', '试听', '喜欢'],
    //             },
    //         ],
    //     })
    // )
    res.json(readFile(count))
    console.log('"haahaha" :>> ', count)
    // console.log('"haahaha" :>> ', res)

    count++
})

app.listen('8090', () => {
    console.log('监听端口 8090')
})
