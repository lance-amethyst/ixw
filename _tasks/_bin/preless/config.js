module.exports = {//不要改动这行！！！
	ifPreview  : true,
	deployTo : './distrib',
	srcRoot: "./asset_samples",
	
	taskDefs :{
		background : {
//			classPrefix : "",  //css Class prefix
//			classPath : "background", // convertor's class path
//			path : "background"		// the directory for the source files relative to srcRoot
		},
		ixicon : {		
			margin:8, // margin for each images in spirit file, default is 16
			classPrefix : "icon-",
			classPath : "picmap"
//			path : "ixicon"
		},
		picmap : {
//			margin:16, // margin for each images in spirit file
			classPrefix : "pic-"
//			path : "picmap", 
//			classPath : "picmap"
		},
		guidepic : {
			margin:8,
			classPrefix : "guide-",		
			classPath : "picmap"
//			path : "guidepic"			
		}
	},
	allTasks :"background,ixicon,picmap,guidepic".split(",")
	
//	"font" : {
//		"version" : "1.0",
//		"fontname" : "yicons",
//		"fontpath" : "css/font/",
//		"fullname" : "Yunfis Icons",
//		"familyname" : "yicons",
//		"copyright" : "Copyright (C) 2013 by Yunfis",
//		//"ascent" : 850,
//		//"descent" : 150,
//		"ascent" : 48,
//		"descent" : 2,
//		"weight" : "Normal"
//	},	
};
