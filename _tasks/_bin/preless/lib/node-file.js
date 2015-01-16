var fs = require('fs'),
    path = require('path'),
    util = require('util');

/**
 * 创建多级目录
 * @param  {String} dirpath 路径
 * @param  {String} mode    模式
 */
var mkdirsSync = function(dirpath, mode) {
    // console.log(dirpath);
    var _dirpath = path.resolve(dirpath);
    // console.log(dirpath);
    if(fs.existsSync(_dirpath))
        return;    
    var dirs = _dirpath.split(path.sep);
    // console.log(dirs);
    var dir = '';
    for(var i = 0; i < dirs.length; i++) {
        dir += path.join(dirs[i],path.sep);
        // console.log(dir);
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir, mode);
    }
};

/**
 * 递归删除目录
 * @param  {String} dirpath 路径
 */
var rmdirsSync = function(dirpath){
    var _dirpath = path.resolve(dirpath);
    // console.log(dirpath);
    if(!fs.existsSync(_dirpath))
        return;
    var dirs = fs.readdirSync(_dirpath);
    // console.log(dirs);
    var dir, len = dirs.length;
    if(len === 0){
        fs.rmdirSync(_dirpath);
        return;
    }
    for(var i = 0; i < len; i++) {
        dir = path.join(_dirpath, dirs[i]);
        // console.log(dir);
        if(fs.statSync(dir).isDirectory()){
            rmdirsSync(dir);
            // fs.rmdirSync(dir);
        }else{
            fs.unlinkSync(dir);
        }
    }
    fs.rmdirSync(_dirpath);
};

/**
 * 列出指定目录的所有文件
 * @param  {String} dirpath      路径
 * @param  {String} type 需要读取的文件的格式, 多类型用","分割, 如: "css,js,html"
 * @param  {Boolean} recursive 是否递归
 * @return {Array}  返回文件名数组
 */
var listFilesSync = function(dirpath, type, recursive){
    var result = [];
    var subdir = arguments[3] || '';
    var _type = type ? type.toLowerCase().replace(/\s+/g, '') : type;
    var typeList = _type ? _type.split(',') : false;
    var _dirpath = path.resolve(dirpath);
    var list = fs.readdirSync(_dirpath);
    var ext, filepath, stat, reldir;
    //把文件按文件名排序
    list.sort();
    for(var i = 0, name; name = list[i]; i++) {
        filepath = path.join(_dirpath , name);
        reldir = path.join(subdir, name);
        stat = fs.statSync(filepath);
        if(stat.isFile()){
            ext = path.extname(name).substr(1);
            if(typeList && typeList.indexOf(ext) === -1){
                continue;
            }
            result.push(reldir);
        }else if(stat.isDirectory() && recursive){
            result = result.concat(listFilesSync(filepath, _type, recursive, reldir));
        }
    }
    return result;
};

/**
 * 拷贝文件到指定目录或指定名字
 * 注意: 该方法只能用于拷贝文本类型的文件, 拷贝图片会损失, 请用 copyFile
 * @param  {String} src       
 * @param  {String} dst       
 * @param  {Boolean} overwrite 
 */
var copyFileSync = function (src, dst, overwrite) {
    var stat, input;
    // console.log('coping ' + src);
    if(!fs.existsSync(src)){
        throw 'File ' + src + ' is not exists.';
    }
    //创建目标目录
    var _dst = dst;
    mkdirsSync(path.dirname(_dst));

    //如果文件不存在, statSync 会出错
    var dstExists = fs.existsSync(_dst);
    if(dstExists){
        stat = fs.statSync(_dst);
        if(stat.isDirectory()){
            _dst = path.join(_dst, path.basename(src));
            if(fs.existsSync(_dst)){//新文件不存在时, 就不用重新判断了
                stat = fs.statSync(_dst);
            }
        }
        if(stat.isFile() && !overwrite){
            //是个文件且不能覆盖
            throw 'File ' + _dst + ' is exists.';
        }
    }else{
        if(isDirectoryPath(_dst)){
            // dst 是个目录
            _dst = path.join(_dst, path.basename(src));
        }
    }
    //直接读取文件内容再写, 会导致非文本格式的文件损坏
    input = fs.readFileSync(src);
    writeFileSync(dst, input, overwrite);
};

/**
 * 拷贝文件到指定目录或指定名字
 * @param  {String} src       
 * @param  {String} dst       
 * @param  {Boolean} overwrite 
 * @param  {Function} callback 
 */
var copyFile = function (src, dst, overwrite, callback) {
    var stat, input, output;
    // console.log('coping ', src, 'to', dst);
    if(!fs.existsSync(src)){
        throw 'File ' + src + ' is not exists.';
    }
    //创建目标目录
    var _dst = dst;
    mkdirsSync(path.dirname(_dst));

    //如果文件不存在, statSync 会出错
    var dstExists = fs.existsSync(_dst);
    if(dstExists){
        stat = fs.statSync(_dst);
        if(stat.isDirectory()){
        	_dst = path.join(_dst, path.basename(src));
            if(fs.existsSync(_dst)){//新文件不存在时, 就不用重新判断了
                stat = fs.statSync(_dst);
            }
        }
        if(stat.isFile()){
            if(!overwrite){
                //是个文件且不能覆盖
                throw 'File ' + _dst + ' is exists.';
            }
            fs.unlinkSync(_dst);
            // console.log('--删除 ' , dst);
        }
    }else{
        if(isDirectoryPath(_dst)){
            // dst 是个目录
        	_dst = path.join(_dst, path.basename(src));
        }
    }
    // 这种异步调用会有并发量问题，文件数目多了之后会出现以下错误
    // Error: EMFILE, too many open files
    input = fs.createReadStream(src);
    output = fs.createWriteStream(_dst);
    input.pipe(output);
    output.on('close', function(err){
        callback && callback();
    });
};

/**
 * 写文件, 自动创建不存在的目录
 * @param  {String} filenName 
 * @param  {String} content   
 * @param  {String} overwrite   
 */
var writeFileSync = function(filenName, content, overwrite){
    mkdirsSync(path.dirname(filenName));
    if(fs.existsSync(filenName)){
        if(!overwrite){
            throw 'File ' + filenName + ' is exists.';
        }
        fs.unlinkSync(filenName);
    }
    fs.writeFileSync(filenName, content);
};

/**
 * 判断传入的 dir是否是个目录，仅从路径名字判断
 * @param  {String}  dir 
 * @return {Boolean}     
 */
var isDirectoryPath = function(dir){
    var index = dir.lastIndexOf(path.sep);
    return index + path.sep.length == dir.length;
};

/**
 * ant 风格的路径匹配查询
 * @param  {String}   root 开始查找的根目录  
 * @param  {String}   pattern  
 */
var query = function(root, pattern){
    var reg = explainPattern(pattern);
    var sources = listFilesSync(root, false, true);
    // console.log(sources)
    var result = [];
    for(var i = 0, s; s = sources[i]; i++){
        if(reg.test(s)){
            result.push(s);
        }
    }
    return result;
};

var explainPattern = function(pattern){
    var sep = path.sep;
    var map = {
        '**': '.*',
        '*': '[^\\' + sep + ']*',
        '?': '[^\\' + sep + ']{1}',
        '/': '\\' + sep,
        '.': '\\.'
    };
    var reg = pattern.replace(/\*\*|\*|\?|\/|\./g, function(m, i, str){
        return map[m] || m;
    });
    console.log(reg);
    reg = new RegExp('^' + reg);
    return reg;
};


exports.mkdirsSync = mkdirsSync;
exports.rmdirsSync = rmdirsSync;

exports.listFilesSync = listFilesSync;
exports.copyFileSync = copyFileSync;
exports.copyFile = copyFile;
exports.writeFileSync = writeFileSync;

exports.isDirectoryPath = isDirectoryPath;

exports.query = query;