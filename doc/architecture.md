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
此文件是为UNIX类终端准备的，Windows操作系统请自行逐行执行。该文件只需要在项目初始化时执行一次即可删除。

初始化完成后，再配置好Web容器，使得整个项目可以通过浏览器访问。例如：将项目目录配置好，其访问地址为`http://localhost/xyz`；则按照要求修改项目目录下的proto/index.htm文件中的第11行

	var IXW_BaseUrl = "http://localhost/xyz"

随后就可以通过浏览器访问`http://localhost/xyz/proto/index.htm`；查看项目是否工作正常。如果不正常，请稍做检查，解决相关问题。

如果一切正常，初始化项目的工作即可完成，该目录即可作为项目的代码基准进入管理。

# 2. 开发和配置
IXW框架的指导思想是配置和惯例，所以，关键的开发工作其实是配置工作，只有局部的开发才需要技巧和技术。项目的开发分为三部分：布局开发，页面开发和组件开发；

## 2.1 布局开发
IXW中的布局一般由三部分组成：布局DOM，导航以及页面族构成；打开`src/ixw/index.js.html`文件。

### 2.1.1 布局DOM结构
模版page构造的是布局对应的DOM结构，对应不同项目的布局，这个模版是首先需要调整；注意其中的子模版nav将对应菜单项的处理，请注意后续的关联逻辑(导航和页面)。

需要注意的是，示例并没有提供子菜单的模版配置，每个项目将根据自身的要求进行针对性的处理。

### 2.1.2 导航
导航主要处理的是布局DOM上的菜单项与页面族之间的联动处理。重点关注文件中的NavManager类的示范，如果需要实现多级，可以自行修改类和对应的常量配置。

需要注意的是：<b>必须按照要求提供getRenderData和focus函数</b>。

	getRenderData：提供渲染菜单所需要的所有参数(由布局DOM结构确定)；
	focus ： 函数则主要通过调用者给定名称自动匹配应该高亮的菜单或者子菜单项
	
接下来就是将导航的实例注册到导航管理IXW.Navs中，按照初始设计目标，到可以存在多个导航实例(有些项目在登录后和登录前不使用同样的菜单体系)，并能自主匹配。但实际工作中，这种情况比较少见，所以这里不多做介绍。下面是注册导航管理的代码样例:

	ixwNavs.register("service", function(cfg){
		if($XP(cfg, "needAuth", true)) navMgr.focus(cfg.navItem || "");
	});

注意：上面代码中的cfg属于页面配置的内容，可以参考2.1.4 页面配置的说明。

### 2.1.3 Session管理
IXW内含用户Session管理：IXW.Session；开发者需要通过调用IXW.Session.config对应用的Session进行配置；该函数接受四个属性（详细接口参见对`src/lib/ixw.js`中configSession的描述）：

	load : 必须提供；用于IXW.Session检测到Session应该被更新时，调用Session数据加载函数
	managerClass ：不是必须；Session数据管理类，用于对Session数据进行封装，提供接口。
		如不提供，将会使用缺省的DefaultSessionManager类;
		如需要自定义，需要提供同样的成员函数。
	onstart : 不是必须，用于当应用从无Session状态进入有Session状态时，回调进行一些业务处理
	onclear : 不是必须，用于当应用清除当前Session时，回调进行一些业务处理

除了config, IXW.Session还提供其他一些接口：

	get ：取得当前的Session数据管理对象，对应于managerClass的实例
	clear ： 手动清除Session, 会激活onclear回调函数
	reset ： 使用特定数据手动重置Session，会激活onstart回调函数
	load ：调用load加载Session数据；
		会激活onclear(Session丢失时)或者onstart(取得新Sesson数据时)回调函数
	reload ：强制刷新应用，包括重新加载Session数据，重新更新页面
	isValid : 判定当前是否有Session数据 	

### 2.1.4 页面配置
IXW框架的基本思路是配置化和自动化，不希望开发者在一些常规的任务上多费心力。在页面的管理(IXW.Pages)上这点尤为突出，IXW.Pages提供了专用的页面配置入口IXW.Pages.configPages；调用实例如下：

	ixwPages.configPages(PagesConfiurations, function(pageName, pageCfg){
		return !$XP(pageCfg, "needAuth", true) || ixwSession.isValid();
	});

此函数的具体参数说明可以看`src/lib/ixw.js`中IXW.Pages.configPages的描述:

	/**  
	pageConfigs : [{
		name: "prjConfig", // 页面的唯一性名称
		path: "projects/{key}/config", //页面路径的匹配模式
		initiator : "Prj.Project.init", //初始化页面的函数名称
		[Optional:] // 页面管理需要的，可以不赋值
		isDefault : true/, default false //是否缺省页面，只能有一个为true
		bodyClz : "minor projectPage projectConfigPage",//页面对应的整体样式
		nav : "String" or function navRefresh(){} // 对应的导航管理入口或者函数
		[user-defined page config :] //用户可自行扩充属性，下面是推荐项
		navItem :  //导航菜单名称
		needAuth : true/false  //是否需要Session支持
		}]
	pageAuthCheckFn :function(name, cfg)
	*
	*/
	IXW.Pages.configPages = function(pageConfigs, pageAuthCheckFn){...}

关于第一个参数的示例，可以参考`src/ixw/index.js.html`中的PagesConfiurations声明；需要注意的是：<b>navItem一般和name保持一致，并且必须在导航管理中明确被处理</b>

页面管理IXW.Pages还包含如下接口：

	createPath ：通过给定页面名称和参数算出页面路径;	
	start ：刷新页面，自行分析上下文或者URL中的路径确定页面
	load ：加载指定路径对应的页面，加载完毕后回调
	reload ：重载制定名称和参数的页面

	getCurrentContext ：取得当前页面对应的上下文，主要是页面配置和参数
	getCurrentName ：取得当前页面的名称
	getCurrentPath ：取得当前页面的路径
	isCurrentPage ：检测路径对应的是不是当前页面
	
	jump ： 解析指定标签的附加信息，激发对应的事件处理(详见：3. 常规动作监听说明)
	listenOnClick ：对制定标签下的所有DOM绑定点击操作，使用常规动作监听。
	bindOnInput ：对特定的INPUT标签绑定事件，避免重复绑定
	
常用的一般是createPath，start，load, listenOnClick函数，其他用的不多。

### 2.1.5 应用startup
IXW还实现了应用的自动加载(IXW.startup)，需要开发者做的：声明在启动时该干些什么。下面是示例：
	
	var appInitialized = false;
	IXW.startup(function(){
		if (appInitialized)
			return;
		appInitialized = true;

		ixwPages.listenOnClick(document.body);
		ixwSession.load(function(){
			ixwPages.start();
		});
	});

如上，简单的来看就三件事：监听常规点击操作，加载Session，刷新当前页面

## 2.2 页面开发
页面的开发，其实很简单，`src/ixw/m1/index.js.html`已经完整的示例了在IXW框架下如何进行页面开发。其中的关键代码如下：

	var nsModule = IXW.ns("ModuleA");
	nsModule.init = function(pageCfg, pageParams, cbFn){
		...
		$X('body').innerHTML = t_info.renderData("", {
			info : ["pageCfg", JSON.stringify(pageCfg), "", 
					"pageParams:",JSON.stringify(pageParams), "",
					"result", JSON.stringify(data)].join("\n")
		});
		cbFn();
		...
	};

`ModuleA`对应的就是前面在2.1.4页面配置中描述的initiator对应的命名空间。函数参数中:

	pageCfg : 对应页面注册时的页面配置信息
	pageParams : 页面被加载时对应的页面参数，主要是页面路径经过模式匹配后的提取的参数
	cbFn：在页面被初始化完成之后，回调给页面管理引擎的通知函数
	
特别得，在页面初始化函数里，可以对pageCfg附加switchOut函数。该函数可以在页面切换出来之前，被引擎调用，做一些清理工作，避免一些遗留得内容导致内存泄漏，重复监听等事宜。该函数得接口如下：

	pageCfg.switchOut = function(currentPageContext, nextPageContext){}

## 2.3 组件开发
组件的开发在IXW框架里没有做明确的规范，这里简单说一下。IXW中的组件一般分为两类：外部组件和项目内组件。
	
	外部组件：对于如何定义，IXW框架基本没有约束；更多的是开发人员之间互相之间的约定和默契，建议通过IX.ns定义独立的命名空间管理这些组件，而且一般将之置于src下的特定目录中。
	项目内组件：将组件代码文件置于src/ixw下的特定目录中，通过IXW.ns规范其命名空间。
	
无论外部组件，还是项目内组件，建议如下的方式定义和声明组件：

	IX.ns('IXW.LibD3');
	var nsD3 = IXW.LibD3;
	/** 在指定显示区域viewbox内显示棱柱/棱锥/棱台
		viewbox : [x,y,w,h]
		options : {
			type : "prism" / "pyramid" / "truncated", 缺省: prism
			schemes : 棱柱配色集,参考DefPolygonSchemes
			max : 最大显示数值 必须为正数
			value : 当前显示数值
			baseH : 最小柱体高度，即当前数值为0时高度
			showAvail : 是否显示剩余数值的柱体
			useBubbles : 是否使用bubbles组件,
			density : 每秒释放的气泡数量
		}
		return {
			setValue : function(v)
			setVisible : function(visible)
			hover : function(overFn, outFn)
		}
	 */
	nsD3.createFrustum = function(svg, viewbox, options){
		...
	};	
 
 
# 3. 常规动作监听

# 4. Ajax／URL管理

# 5. 简单模版使用

# 6. 管理工具集

##6.1 小图片管理

##6.2 发布管理

##6.3 上线发布管理

