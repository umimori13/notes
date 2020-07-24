function changeArr(arr) {
    const newArr = arr.map((val) => {
        return {
            x: val.y,
            y: val.x,
        }
    })
    return newArr
}

const arr = [
    { x: 1, y: 2 },
    { x: 4, y: 5 },
]
console.log('object :>> ', changeArr(arr))
console.log('arr :>> ', arr)
