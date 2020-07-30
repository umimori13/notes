potree-core 缺点：
读取过卡，有可能设置 budget 数量无用
xy 轴似乎不对（与正常 potree 不一致 ）
显示点变大/变小（可能与摄像机距离计算有关
点渲染距离不对，可能本在前面渲染的跑到后面去

potree-loader
没有 EDL 渲染功能

potree 问题:
potree 的 camera 操控主要为球形 pitch 和 yaw 进行操控
主要针对 camera 旋转的 xz 轴操控，不对 y 进行任何修改
如果要进行修改，将很容易对 potree 的 camera 运行造成
极其抖动的变化，这点可能可以通过动画运行的方式进行
适应，但可能并不是那么简单的
