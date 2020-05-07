// var qwq = function sum(num1,num2){
//     return num1+num2
// }
// console.log(sum(10,10))
function b(){
    cb()
    function cb(){
        console.log(arguments.callee.caller)
    }
}
b()