# 在 VSCode 中调试 webpack-dev-server 项目

## 准备

需要下载 DEbugger for Chrome 插件

## 使用

在需要进行 debug 的文件下启动 debug，配置 launch.json 和 tasks.json 文件

注意上面这一大段并非都是必要的，反复测试后，总结出只有下面这些属性必须指定，其他将自动取默认值：

---

在 launch.json 文件中

1. `url`—— 对应所在的域名
2. `preLaunchTask` —— 在 tasks 中对应的名称
3. `sourceMapPathOverrides` —— 源码对应，如果没用的画可能会因为编译原因导致无法正确下断点

---

在 tasks.json 文件中

1. `version`、`command`——配置的版本号、要运行的命令；
2. `label`——Task 的名称；
3. `isBackground`——指示 Task 是否在后台运行，必须为 true，告诉 VSCode 可以在 Task 运行时启动调试会话，具体的启动时机由后面的 background.endsPattern 指定；
4. `problemMatcher.pattern.regexp`——编辑器从命令输出提取警告/错误/提示消息使用的 pattern；
5. `background`——指示 Task 后台运行时，VSCode 如何跟踪 Task 运行状态，具体是依靠 Task 所执行命令的输出来判断的，两个 pattern 属性分别表示 Task 启动或结束时输出的消息特征（注意特征不惟一，可以从 TERMINAL 面板的输出自行确定），VSCode 在接收到符合 pattern 的消息后开始或停止对 Task 的跟踪。当跟踪停止后，VSCode 按 launch.json 配置启动调试会话（如不指定 pattern，VSCode 不会对 tasks.json 报错，但运行 Task 10 秒后将提示 The specified task cannot be tracked. 并中止调试）。
