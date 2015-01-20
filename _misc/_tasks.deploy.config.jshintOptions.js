module.exports ={
	//curly:true,  //大括号包裹  
	//eqeqeq:true,  //对于简单类型，使用===和!==，而不是==和!=  
	//newcap:true,  //对于首字母大写的函数（声明的类），强制使用new  
	noarg:true,  //禁用arguments.caller和arguments.callee  
	//sub:true,  //对于属性使用aaa.bbb而不是aaa['bbb']  
	undef:true,  //查找所有未定义变量  
	boss:true,//查找类似与if(a = 0)这样的代码  
	node:true,
	globals: {
		IX : true,
		window: true,
		document : true,
		IX_GLOBAL : true,
		IXDebug : true,
		debugIsAllow : true,
		IX_DEBUG_MODE :true,
		IX_SCRIPT_NAME : true,
		IX_VERSION : true,
		"{NS}" : true,
		"$X" : true,
		"$XA" : true,
		"$XD" : true,
		"$XP" : true,
		"$XE" : true,
		"$XF" : true
	}
};