module.exports = {
	name: "{PRJ}", 
	description : "{NS} web frontend project based on IXW",
	namespace: "{NS}",
	version: "1.0",

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
//		jsUrl : "http://localhost/{PRJ}/_rel/js",
//		imagesUrl : "http://localhost/{PRJ}/_rel/img",
//		cssUrl : "http://localhost/{PRJ}/_rel/css"
	},

	grunt : {
		clean :{
			deploy : ["_dist/"],
			release : ["_rel/"],
			afterRel : ["_dist.copy/"]
		},
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
					"$XF" : true,
					"$XH" : true,
					"IXW" : true
				}
			},
			files : {src : ['src/ixw/*.js']},
			afterconcat: ['_dist/js/<%= pkg.name %>.js']
		},
		less :{
			deploy:{
				options: {
					paths: ["src/less"]
				},
				files: {
					"_dist/css/<%= pkg.name %>.css": "src/less/core.less"
				}
			}
		},
		concat: {
			ixw :{
				src : ["src/lib/ix.js", "src/lib/jquery-2.1.1.js", "src/bootstrap/js/bootstrap.js", "src/lib/ixw.js", "src/lib/ixwui.js"],
				dest : "_dist/js/ixw.js"
			},
			project :{
			   src : ["src/ixw/index.js"],
			   dest : "_dist/js/<%= pkg.name %>.js"
			}
		},
		copy: {
			deploy: {
				files: [
					//{src: ['path/*'], dest: 'dest/', filter: 'isFile'},// 复制path目录下的所有文件  
					//{src: ['path/**'], dest: 'dest/'},// 复制path目录下的所有目录和文件  
					{cwd: 'src/bootstrap/', src: ['fonts/**'], dest: '_dist/bootstrap/', expand: true, filter: 'isFile'},
					{cwd: 'src/', src: ['images/**'], dest: '_dist/', expand: true, filter: 'isFile'},
					{cwd: 'proto/dist/', src: ['*'], dest: '_dist/', expand: true, filter: 'isFile'}
				]
			},
			beforeRel : {
				files : [
					{cwd : '_dist', src: ['bootstrap/**'], dest: '_rel/', expand: true, filter: 'isFile'},
					{cwd : '_dist', src: ['css/**'], dest: '_dist.copy/', expand: true, filter: 'isFile'},
					{cwd : '_dist', src: ['js/**'], dest: '_dist.copy/', expand: true, filter: 'isFile'},
					{cwd : '_dist', src: ['images/**'], dest: '_dist.copy/', expand: true, filter: 'isFile'}
				]
			},
			release : {
				files: [
					{cwd : '_dist.copy', src: ['images/**'], dest: '_rel/', expand: true, filter: 'isFile'}
				]
			}
		},
		uglify :{
			options: {
				banner:' /*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				beautify: {ascii_only:true},
				maxLineLen : 8192
			},
			release :{files :[
				{cwd: '_dist.copy/js', src: '**/*.js', dest: '_rel/js', expand  :true}
			]}
		},
		cssmin : {
			release : {files :[
				{cwd: '_dist.copy/css', src : ["*.css"], dest : '_rel/css', expand  :true}
			]}
		}
	}
};
