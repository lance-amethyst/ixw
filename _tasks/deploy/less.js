module.exports ={
	options: {
		paths: ["src/less"],
		modifyVars: {
			imgPath: 'http://sample.com/images',
			distrib: '<%= pkg.distriNo %>'
		}
	},
	
	files: {
		"dist/css/prj.css": "src/less/core.less"
	}
};