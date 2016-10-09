module.exports = {
	config : {
		// "pure" -- only Web Frontend 
		// "mixed" -- Both Web Frontend and Backend (supported by shell)
		type : "pure",
		name : "prj",  //new project name,
		ns : "PRJ",
		path : "../prj"
	},

	clean :{
		pure : ["0/", "tmp/"],
		mixed : ["0/", "tmp/"]
	},
	"string-replace" : {
		options: {
			replacements: [
				{pattern: '{PRJ}', replacement: '<%= config.name %>'},
				{pattern: '{NS}', replacement: '<%= config.ns %>'}
			]
		},
		pure : {  files: [
			{cwd: '_tpl/', src: '_www.ixw_config.js', dest: '0/ixw_config.js'},
			{cwd: '_tpl/', src: '_www.package.json', dest: '0/package.json'},
			{cwd: '_tpl/', src: '_www.src.ixw.index.js.html', dest: '0/src/ixw/index.js.html'},
			
			{cwd: '_tpl/', src: '_front.proto.index.htm', dest: '0/proto/index.htm'},
			{cwd: '_tpl/', src: '_front.proto.dist.index.htm', dest: '0/proto/dist/index.htm'}
		]},
		mixed : { files: [
			{cwd: '_tpl/', src: '_www.ixw_config.js', dest: '1/www/ixw_config.js'},
			{cwd: '_tpl/', src: '_www.package.json', dest: '1/www/package.json'},
			{cwd: '_tpl/', src: '_www.src.ixw.index.js.html', dest: '1/www/src/ixw/index.js.html'},

			{cwd: '_tpl/', src: '_server.package.json', dest: '1/server/package.json'},
			{cwd: '_tpl/', src: '_server.public.index.htm', dest: '1/server/public/index.htm'},
			{cwd: '_tpl/', src: '_server.service.db.db.sql', dest: '1/server/service/db/db.sql'},
			
			{cwd: '_tpl/', src: '_www.proto.sim.htm', dest: '1//www/proto/sim.htm'},
			{cwd: '_tpl/', src: '_www.package.json', dest: '1/www/proto/index.htm'}
		]}
	},
	concat: {
		"tmp/ixw.js" : ["_lib/_ixw/base.js","_lib/_ixw/session.js", "_lib/_ixw/engine.js","_lib/_ixw/pages.js"],
		"tmp/ixwui.js" : [
				"_lib/_ixwui/base.js","_lib/_ixwui/dialog.js", "_lib/_ixwui/sysDialog.js", 
				"_lib/_ixwui/fileUploader.js","_lib/_ixwui/datepicker.js", "_lib/_ixwui/pagination.js",
				"_lib/_ixwui/chosable.js"],
		"tmp/ixwext.js" : ["_lib/_ixwext/mouse.js"],
		"tmp/ets.js" : ["_bin/tpl/wrap/hdr.js", 
			"_bin/tpl/lib/parser.js","_bin/tpl/lib/translator.js","_bin/tpl/browser/ets.js",
			"_bin/tpl/wrap/foot.js"]
	},
	copy: {
		pure : { files : [
			{cwd: '_tpl/www/', src: ['*'], dest: '0/', expand: true},
			{cwd: '_assert/', src: ['*'], dest: '0/_assert', expand: true},
			{cwd: '_mapdata/', src: ['*'], dest: '0/_mapdata', expand: true},
			{cwd: '_tasks/', src: ['*'], dest: '0/_tasks', expand: true},
			{cwd: '_bin/tpl/lib', src: '*.js', dest: '0/_tasks/deply/_lib'},

			{cwd: '_lib/', src: ['ixwui.less'], dest: '0/src/less'},
			{cwd: '_tpl/', src: 'fp_post.sh', dest: '0/init_project.sh'}
		]},
		mixed: { files: [
			{cwd: '_tpl/www/', src: ['*'], dest: '1/www/', expand: true},
			{cwd: '_tpl/server', src: ['*'], dest: '1/server/', expand: true},
			{cwd: '_assert/', src: ['*'], dest: '1/www/_assert', expand: true},
			{cwd: '_mapdata/', src: ['*'], dest: '1/www/_mapdata', expand: true},
			{cwd: '_tasks/', src: ['*'], dest: '1/www/_tasks', expand: true},
			{cwd: '_bin/tpl/lib', src: '*.js', dest: '1/www/_tasks/deply/_lib'},

			{cwd: '_lib/', src: ['ixwui.less'], dest: '1/www/src/less'},
			{cwd: '_tasks/', src: ['_lib/ix.js'], dest: '1//server/service/util/ix.js'},
			{cwd: '_tpl/', src: 'bp_post.sh', dest: '1/init_project.sh'}
		]},
		"post-pure" : { files : [
			{cwd: '0/', src: ['**'], dest: '<%= config.path %>', expand: true},
			{cwd: 'tmp/', src: ['*.js'], dest: '<%= config.path %>/src/lib', expand: true}
		]},
		"post-mixed" : { files : [
			{cwd: '1/', src: ['**'], dest: '<%= config.path %>', expand: true},
			{cwd: 'tmp/', src: ['*.js'], dest: '<%= config.path %>/www/src/lib', expand: true}
		]}
	},

	jshint :{
		options: {
			"-W030" : true, // 禁止告警：Expected an assignment or function call and instead saw an expression
			browser : true,
			force : false, //设置为 true 将会报告 JSHint 错误，而不会将任务失败掉
			//curly:true,  //大括号包裹  
			//eqeqeq:true,  //对于简单类型，使用===和!==，而不是==和!=  
			//newcap:true,  //对于首字母大写的函数（声明的类），强制使用new  
			noarg:true,  //禁用arguments.caller和arguments.callee  
			//sub:true,  //对于属性使用aaa.bbb而不是aaa['bbb']  
			undef:true,  //查找所有未定义变量  
			boss:true,//查找类似与if(a = 0)这样的代码  
			node:true,
			globals: {
				//window: true,
				//document : true,
				//"history" : true,
				IX_GLOBAL : true,
				IXDebug : true,
				debugIsAllow : true,
				IX_DEBUG_MODE :true,
				IX_SCRIPT_NAME : true,
				IX_VERSION : true,

				"alert" : true,
				// "escape" : true,
				// "unescape" : true,
				// "localStorage" : true,
				"requestAnimationFrame" : true,
				"d3" : true,
				"THREE" : true,
				"topojson" : true,

				"jQuery" : true,
				"IX" : true,
				"$X" : true,
				"$Xw" : true,
				"$XA" : true,
				"$XD" : true,
				"$XP" : true,
				"$XE" : true,
				"$XF" : true,
				"$XH" : true,
				"IXS" : true,
				"IXW" : true,
				"IXW_NS" : true,
				"IXW_BaseUrl" : true
			}
		},
		files : [
			'_lib/**/*.js', '_tasks/**/*.js','_tpl/server/*.js',
			'_tpl/www/proto/*.js','_tpl/www/*.js','_tpl/*.js',
			'0/**/*.js', '1/**/*.js', "tmp/*.js"
		]
	}
};
