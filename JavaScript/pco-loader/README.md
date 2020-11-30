three-loader-example

# 说明

-   本样例以 three-loader 为基础，作为 potree 核心功能的替代，使之能够完全以 threejs 源 camera,scene,renderer 的方式进行渲染点云功能
-   本样例暂包含 potree 中的点云渲染、切割盒、EDL 阴影渲染功能

### 安装

必须已安装 [node.js](http://nodejs.org/)

并已安装 yarn

如未安装 yarn 可通过

```bash
npm install yarn -g
```

若已安装 yarn，可直接在根目录运行

```bash
yarn
```

需要在 public 下放入 pointcloud 文件夹
pointcloud 文件夹是由 potree converter 生成，内部有 cloud.js,sources.json, data 和 temp 文件夹

### 启动样例

运行

```bash
yarn start
```

即可

### 代码功能位置

点云鼠标射线与点的交点-主要在 operation.js 中
EDL 功能主要在 edl 开头的文件中
生成切割盒位于 clipboxes.js 中
