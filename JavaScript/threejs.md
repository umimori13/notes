暂定：对 camera 的 set 会在 apply 之前，怀疑是更新时候，后者会被优先更新

正常情况下直接对一个对象进行旋转操作，都是围绕其本身的，如果需要围绕原点则提供以下方法：
如果是 mesh 的顶点 ，进行矩阵操作前必须要 render(scene,camera);不知道为什么，有知道的请指导一下；
如果是对 geometry 的顶点进行矩阵操作，就不存在需要先画的问题，代码如下。

camera 通常以 y 为上，对 orbitControl 等都有较大影响

orbitcontrol 会更新 lookAt，所以如果 update 的话就不要在外面更新 camera 的 qua 或者 rotation 了

var geometry1=planeGeometry.clone();
m.makeRotationY(beta);
var n = new THREE.Matrix4();
n.makeTranslation(0, 0, -400);
geometry1.applyMatrix(n);
geometry1.applyMatrix(m);

camera 等属性都能更改，但是需要 updateProjectionMatrix()

方法 1：
    var mesh = new THREE.Mesh(geom,material);

scene.add(mesh);

border = new THREE.BoxHelper( mesh,0x0dc3b4 );//设置边框，这个边框不会旋转

scene.add( border );

用这种方法，比如我要旋转立方体，边框不会跟着改变。

方法 2：
    var mesh = new THREE.Mesh(geom,material);

scene.add(mesh);

edges = new THREE.EdgesHelper( mesh, 0x1535f7 );//设置边框，可以旋转

scene.add( edges );

注意一个设置
canvas { width: 100%; height: 100%;display: block; }
在有些情况下，滑动条会导致一些判定出错（例如射线）
因此这条要进行改动以消去滑动条

vector,matrix 有些操作是会影响到原来的值，一定要注意嗷

BufferGeometry 会缓存网格模型，性能要高效点。网格模型生成原理

1、Geometry 生成的模型是这样的 （代码）-> (CUP 进行数据处理，转化成虚拟 3D 数据) -> (GPU 进行数据组装，转化成像素点，准备渲染) -> 显示器
第二次操作时重复走这些流程。

2、BufferGeometry 生成模型流程 (代码) -> (CUP 进行数据处理，转化成虚拟 3D 数据) -> (GPU 进行数据组装，转化成像素点，准备渲染) -> (丢入缓存区) -> 显示器
第二次修改时，通过 API 直接修改缓存区数据，流程就变成了这样
(代码) -> (CUP 进行数据处理，转化成虚拟 3D 数据) -> (修改缓存区数据) -> 显示器

节约了 GPU 性能的运算性能

three-full 目前是 r113 版本，当前 three.js 是 r119 版本（20200731），容易出错，因此不建议使用
