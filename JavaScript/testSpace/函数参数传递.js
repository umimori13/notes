function setName(obj){
    obj.name = "qwq"
    obj = new Object()
    obj.name = "xwx"
}
var a = new Object()
setName(a)
console.log(a.name)//qwq