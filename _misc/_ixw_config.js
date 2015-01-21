module.exports = {
	name: "{PRJ}", 
	description : "sample web frontend project based on IXW",
	namespace: "{NS}",
	version: "1.0",
	distrib: "dev",
	"release-target": "./dist",

	defaultTasks : "deploy",

	preless :{
  		src : "./_asserts",
  		dest : "./src",	
  		demoDest : "./_demo",	
		background : [{
//			classPrefix : "bg",  // css Class prefix, default is bg
//			path : "background"		// the directory for the source files relative to srcRoot
		}],
		picmap : [{		
//			margin:8, // margin for each images in spirit file, default is 8
			classPrefix : "pg1", // defualt is pic
			path : "picgrp1" // default is "pic"
		}, {
//			margin:8, // margin for each images in spirit file
			classPrefix : "pg2",
			path : "picgrp2"
		}]
	},
	deploy: {
		
	},

	release :{

	},

	grunt : {
		jshint :{
			options: {	
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
			},
			files : {src : ['src/ixw/*.js']},
			afterconcat: ['dist/js/{PRJ}.js',]
		},
		less :{
			deploy:{
				options: {
					paths: ["src/less"]
				},
				files: {
					"dist/css/{PRJ}.css": "src/less/core.less"
				}
			}
		},
		concat: {
			ixw :{
				src : ["src/lib/ix.js", "src/lib/jQuery-2.1.1.js", "src/bootstrap/js/bootstrap.js"],
				dest : "dist/js/ixw.js"
			},
			project :{
			   src : ["src/ixw/index.js"],
			   dest : "dist/js/{PRJ}.js"
			}
		},
		copy: {
			deploy: {
				files: [
				    //{src: ['path/*'], dest: 'dest/', filter: 'isFile'},// 复制path目录下的所有文件  
				    //{src: ['path/**'], dest: 'dest/'},// 复制path目录下的所有目录和文件  
					{src: ['src/bootstrap/fonts/*'], dest: 'dist/bootstrap/fonts/', expand: true, flatten: true, filter: 'isFile'},
					{src: ['proto/dist/*'], dest: 'dist/', expand: true, flatten: true, filter: 'isFile'}
				]
			}
		}
	}
};
