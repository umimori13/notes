var a = [2,6]
console.log(a[1])
b = a.concat()
b[1] = 23
console.log(a,b)
b = a.splice(1,0,"qwq")
console.log(a,b)