module.exports ={
	ixw :{
		src : ["src/lib/ix.js", "src/lib/jQuery-2.1.1.js", "src/bootstrap/js/bootstrap.js"],
		dest : ["dist/js/ixw"]
	},
	project :{
	   src : ["src/ixw/index.js.html"],
	   dest : ["dist/js/<%= pkg.name %>"]
	}
};