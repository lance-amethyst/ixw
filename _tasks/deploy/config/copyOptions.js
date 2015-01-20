module.exports ={
	files: [  
	    //{src: ['path/*'], dest: 'dest/', filter: 'isFile'},// 复制path目录下的所有文件  
	    //{src: ['path/**'], dest: 'dest/'},// 复制path目录下的所有目录和文件  
		{src: ['src/bootstrap/font/*'], dest: 'dist/bootstrap/font', filter: 'isFile'}
	]
};