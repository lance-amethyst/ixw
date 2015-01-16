#! /usr/bin/env node

var fs = require("fs");

var parser = require("../lib/parser.js").parser;
var translator = require("../lib/translator.js");

console.log("Usage : node tplc [--NS=IX.Tpl] [--line-delimiter=window|unix] [-m] [-c] [-v] [rootPath]");

var root_path = process.cwd(), includeSubFolders = true, replaceJSFile = true, removeJSFile = false;
var newline = "\n", nsName = "IX.Tpl";

function parseArg(arg){
	var ci = arg.toLowerCase();
    if(ci[0] != "-"){
        root_path = arg;
        return;
    }
    
    //不包含子文件夹
    if(ci == "-m") includeSubFolders = false;
    //不替换已有的js
    else if(ci == "-c") replaceJSFile = false;
    //不保留生成的js文件
    else if(ci == "-v") removeJSFile = true;
    //取得模版生成的命名空间
    else if (ci.substring(0,5) == "--ns=") nsName = arg.substring(5);
    else if (ci == "--line-delimiter=window") newline = "\r\n";
}
args = process.argv;
for(var i = 2, ci, j = args.length; i < j; i ++)
	parseArg(args[i]);

root_path = root_path || process.cwd();
console.log("root path: " + root_path);
console.log("include subfolders:" + includeSubFolders);
console.log("replace the existing js files:" + replaceJSFile);
console.log("remove generated js files:" + removeJSFile);

var TplFileReg = /\.js\.html?$/g;
function _parse_file(_filePath) {
	var sourceFilePath = _filePath.replace(TplFileReg, '.js');
    if(fs.existsSync(sourceFilePath)){
        if(!replaceJSFile){
            console.log(" skip files: " + _filePath + " is skipped");
            return;
        }
        fs.unlinkSync(sourceFilePath);
    }
    console.log("begin compile");
    var context = fs.readFileSync(_filePath, "utf8");
    
    console.log("parsing ...");
    var result = parser.parse(context);
    
    console.log("translating ... ");
    result = translator.translate(result, {
    	newLine: newline,
    	nsName : nsName
    });
    
    if("error" in result)
        return console.error("file: " + _filePath + " has error:" + result.error);
    
    console.log("write to file :" + sourceFilePath);
    fs.writeFileSync(sourceFilePath, result.code);
      
	var refFilePath = sourceFilePath + ".ref.js";
    if(fs.existsSync(refFilePath))
        console.error("compare with ref file:" + ((fs.readFileSync(refFilePath, "utf8") == result.code)?"SAME":"DIFF") + " for " + _filePath + "");
    
    console.log("compile done");
    if(removeJSFile)
    	fs.unlinkSync(sourceFilePath);
}
function parse_file(_filePath){
    try{
    	_parse_file(_filePath);
    }catch(ex){
        console.log("file: " + _filePath + " compile fail: [" + ex.valueOf() + "]");
    }
}
function getFileInfo(_fileName, _filePath){
    fs.stat(_filePath, function(err, file){
        if(err)
        	return console.error(err);
        if(file.isFile() && TplFileReg.test(_fileName)) {
            console.log("-------begin file: " + _filePath);
            parse_file(_filePath);
            console.log("-------file end");
        }else if(file.isDirectory() && includeSubFolders){
            search_folder(_filePath);
        }
    });
}
function search_folder(_folderPath){
    fs.readdir(_folderPath, function(err, files){
        if(err) 
        	return console.error(err);
        for(var i = 0, j = files.length; i < j; i ++){
            getFileInfo(files[i], _folderPath+"/"+files[i]);
        }
    });
}

console.log("----------------begin compile -----------------");
if(TplFileReg.test(root_path)){
    parse_file(root_path);
}else{
    search_folder(root_path);
}