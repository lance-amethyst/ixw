module.exports ={
	options: {
		paths: ["src/less"],
		modifyVars: {
			imgPath: 'http://sample.com/images',
			distrib: '<%= pkg.distribNo %>'
		}
	},
	
	files: {
		"dist/css/{PRJ}.css": "src/less/core.less"
	}
};