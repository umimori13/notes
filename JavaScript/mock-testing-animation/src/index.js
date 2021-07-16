// import clientGet from './client'
// import clientGet from './client2'
// import clientGet from './client3'
import clientGet from './clientTenPoints'
import init from './exampleThree'
import getData from './getData'

init()
// const id = setInterval(() => {
//     getData(id)
// }, 50)
clientGet('ws://10.11.132.37:9090')
