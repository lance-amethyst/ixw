module.exports = {
	name: "{PRJ}", 
	description : "IX sample web frontend project",
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

	deploy : {

	},

	release :{

	}
};
