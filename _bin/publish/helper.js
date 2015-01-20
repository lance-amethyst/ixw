var fs = require("fs");
var path = require("path");
var tplParser = require("../tpl/cmd/tpl_parser.js");
var tplToJS = require("../tpl/cmd/parsetojs.js");
var os = require("os"), endLine='\n';

switch(os.platform()){
    case "win32":
    case "win64":
    case "windows":
        endLine = '\r\n';
        break;        
}

function isJsFile(filePath){
    if(!filePath)
        return false;
    return /.js$/i.test(filePath)||/.htm([l]?)$/i.test(filePath);
}

// /*
// 递归处理文件
// */
// function walkFiles(dir, handleFile) {
//     handleFile(dir);

//     fs.readdir(dir, function(err, files) {
//         if (err)
//             return console.log('read dir error');
        
//         files.forEach(function(name) {
//             var _dir = dir + '/' + name;

//             fs.stat(_dir, function(err, file) {
//                 if (err) 
//                     return console.log('stat error');

//                 if (file.isDirectory()) {
//                     walk(_dir);
//                 } else {
//                     handleFile(_dir);
//                 }
//             })
//         });
//     });
// }

// function handleJsFile(filePath) {
//     if(!isJsFile(filePath)) return;

//     console.log("parse beigin:",filePath);

//     var text = fs.readFileSync(filePath, "utf8");
//     if(!text) return;
//     text = parseTplText(text);
//     console.log("parse end:",filePath);
    
//     fs.writeFileSync(filePath, text);
// }

function parseTpl(str,data){
    for(var k in data){
        str=str.replace(new RegExp("{"+k+"}","img"),data[k]);
    }
    return str;
}

function parseEntosTpl(str){
    if(!str)return '';

    var tpl = tplParser.parse(str);
    var toJs = tplToJS.EntosTplToJS(tpl, {newLine: endLine});
    if(toJs.error){
        console.log("file: " + filePath + " has error:" + toJs.error);
        return '';
    }
    return toJs.code;
}

function rewriteFile(filePath, saveFilePath, data){
    //fs.unlinkSync(saveFilePath);

    var text = fs.readFileSync(filePath, "utf8");
    if(text){
        text = parseTpl(text,data);
        fs.writeFileSync(saveFilePath, text);
    }
}

module.exports = {
    isJsFile: isJsFile,
    rewriteFile: rewriteFile,
    parseTpl: parseTpl,
    parseEntosTpl: parseEntosTpl,
    endLine: endLine
};

//handleJsFile('');