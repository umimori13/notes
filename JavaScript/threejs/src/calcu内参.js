import {
    Matrix3,
    Vector3,
} from 'three'
export default function calcuCalibration(val,x,y,mulFac = 1,) {
    console.log('val,x,y,mulFac :>> ', val,x,y,mulFac);
    let mat = new Matrix3()
    mat.fromArray(val)
    mat = mat.transpose()
    mat = mat.getInverse(mat)
    console.log('mat inverse :>> ', JSON.stringify(mat.elements))
    // mat = mat.transpose()
    console.log('object :>> ', mat);
    let vect3 = new Vector3(x,y,1)
    let vectZero = new Vector3(0,0,1)
    let resultZero = vectZero.applyMatrix3(mat)
    let result = vect3.applyMatrix3(mat)
    //result储存 图像（h,w）与（0，0）处的相机归一化坐标的差
    result.x = (result.x - resultZero.x) * mulFac
    result.y = (result.y - resultZero.y) * mulFac
    console.log('YAMLresult :', result);
    let cameraShift = {}
    const [cx,cy] = [val[2],val[5]]
    const W =  x
    const H = y
    cameraShift.x = (cx - W/2)/W * result.x 
    cameraShift.y = (cy - H/2)/H * result.y 
    console.log('W,H,cameraShift :>> ', cx,cy,W,H,cameraShift);
    return [result,cameraShift]
}