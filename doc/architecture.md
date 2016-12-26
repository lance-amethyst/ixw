# 基于IXW框架的项目开发指南

本文只针对纯前端模式的项目。混合模式项目的前端开发完全类似，后端将会在其他资料中解释。

本文将基于IXW框架生成的示例项目进行说明。

# 1. 初始化项目
按照项目生成完成后的提醒，执行项目根目录下的`sh init_project.js`或者按步骤执行文件内的命令。
<pre>
#!/usr/sh

npm install > /dev/null
grunt preless
grunt deploy
</pre>
文件是为UNIX类终端准备的，Windows操作系统请自行逐行执行。该只需要在第一次初始化时执行一次即可删除。

初始化完成后，再配置好Web容器，使得整个项目可以通过浏览器访问。例如：将项目目录配置好，其访问地址为`http://localhost/xyz`；则按照要求修改项目目录下的proto/index.htm文件中的第11行

	var IXW_BaseUrl = "http://localhost/xyz"

随后就可以通过浏览器访问`http://localhost/xyz/proto/index.htm`；查看项目是否工作正常。如果不正常，请稍做检查，解决相关问题。

如果一切正常，初始化项目的工作即可完成，该目录即可作为项目的代码基准进入管理。

# 2. 页面，导航，布局等配置

 