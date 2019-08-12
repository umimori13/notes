工具类函数都会放在这里
目录：
INDEX00001：threejs向量插值
INDEX00002：


----INDEX00001
function lerp (a,b,f)
{
ret = new THREE.Vector3();
ret.x = a.x + f * (b.x - a.x);
ret.y = a.y + f * (b.y - a.y);
ret.z = a.z + f * (b.z - a.z);
return ret;
}

----INDEX00002