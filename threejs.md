暂定：对camera的set会在apply之前，怀疑是更新时候，后者会被优先更新

正常情况下直接对一个对象进行旋转操作，都是围绕其本身的，如果需要围绕原点则提供以下方法：
如果是 mesh 的顶点 ，进行矩阵操作前必须要 render(scene,camera);不知道为什么，有知道的请指导一下；
如果是对geometry的顶点进行矩阵操作，就不存在需要先画的问题，代码如下。

orbitcontrol 会更新lookAt，所以如果update的话就不要在外面更新camera的qua或者rotation了

var geometry1=planeGeometry.clone();
            m.makeRotationY(beta);
            var n = new THREE.Matrix4();
            n.makeTranslation(0, 0, -400);
            geometry1.applyMatrix(n);
            geometry1.applyMatrix(m);

camera等属性都能更改，但是需要updateProjectionMatrix()

方法1：
    var mesh = new THREE.Mesh(geom,material);

    scene.add(mesh);

    border = new THREE.BoxHelper( mesh,0x0dc3b4 );//设置边框，这个边框不会旋转

    scene.add( border );

用这种方法，比如我要旋转立方体，边框不会跟着改变。

方法2：
    var mesh = new THREE.Mesh(geom,material);

    scene.add(mesh);

    edges = new THREE.EdgesHelper( mesh, 0x1535f7 );//设置边框，可以旋转

    scene.add( edges );
--------------------- 
作者：la_啦 
来源：CSDN 
原文：https://blog.csdn.net/u011011025/article/details/50723417 
版权声明：本文为博主原创文章，转载请附上博文链接！

注意一个设置
canvas { width: 100%; height: 100%;display: block;  }
在有些情况下，滑动条会导致一些判定出错（例如射线）
因此这条要进行改动以消去滑动条

vector,matrix有些操作是会影响到原来的值，一定要注意嗷
