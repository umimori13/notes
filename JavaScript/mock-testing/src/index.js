import Axios from 'axios'

Axios.get('http://localhost:3000/news').then((res) =>
    console.log('res :>> ', res)
)
