var _ = require("underscore");
var path = require('path');
var fs = require('fs');
var config = require("./config");
var helper = require("./helper");
var srcDir = config.srcDir;
var srcJsDir = path.join(srcDir.root,srcDir.js);
var srcCssDir = path.join(srcDir.root,srcDir.css);
var srcImgDir = path.join(srcDir.root,srcDir.img);
var destDir = config.destDir;
var destJsDir = path.join(destDir.root,destDir.js);
var destCssDir = path.join(destDir.root,destDir.css);
var destImgDir = path.join(destDir.root,destDir.img);
var timeStamp = config.timeStamp;
var endLine = helper.endLine;
var htmlSuffixExpr = /(.*?)\.htm[l]?$/;
var ifDeploy, ifPreview, ifPreviewClient, ifPreviewServer;
var convertionFiles = {};
var wwwDir = "", serviceDir = '';

function parseJsText(src, filePath){
  if(/.htm([l]?)$/i.test(filePath))
    src = helper.parseEntosTpl(src);

  if(ifDeploy&&filePath.indexOf('global-const.js')>=0){
    src = ['(function(){IX.ns("Entos");',
           'Entos.timeStamp="'+timeStamp+'";',
           'Entos.wwwSiteUrl="'+config.wwwSiteUrl+'";',
           'Entos.staticSiteUrl="'+config.staticSiteUrl+'";',
           'Entos.serviceSiteUrl="'+config.serviceSiteUrl+'";',
           'Entos.avatarSiteUrl="'+config.avatarSiteUrl+'";',
           '})();', src].join('');
  }
  return src;
}
function convertFileName(fileName,dir){
  if(!fileName)return "";
  var lastIndex = fileName.lastIndexOf('.'),
      name = fileName.substring(0,lastIndex),
      ext = fileName.substring(lastIndex),
      fname = name+timeStamp+ext;
  if(dir)
    return path.resolve(dir,fname);
  return fname;
}
function convertFiles(files, cfg){
  if(!files)return;  

  if(!_.isArray(files))
      return files;
  
  cfg = cfg||{};
  var newFiles = [];
  _.each(files,function(item){
      var dir = path.resolve(cfg.src,item.cwd||''),
          src = [], dest = item.dest||'',
          arr = item.src,
          isHtml = htmlSuffixExpr.test(dest);
      if(!_.isArray(arr))
        arr = arr.split(',');

      if((ifDeploy||ifPreviewServer)&&item.dest.indexOf('global-')===0){
        dir = path.join(config.serverDestDir.root, config.serverDestDir.serverJs);
      }

      arr.forEach(function(s){
        s.split(',').forEach(function(s2){
          s2=s2.trim();
          if(s2){          
            isHtml&&!htmlSuffixExpr.test(s2)&&(s2+='.html');
            src.push(path.resolve(dir,s2));
            if(ifPreviewClient&&s2=="ixbase.js")
              src.push(path.resolve(dir,'test.js'));
          }
        });
      });

      var res = _.clone(item);
      res.src = src;
      res._dest = dest;
      if(cfg.needConvertFileName){        
        res._dest = convertFileName(item.dest);
        res.dest = convertFileName(item.dest, cfg.dest);        
      }
      else
        res.dest = path.resolve(cfg.dest, item.dest);
      newFiles.push(res);      
  });
  //console.log(newFiles)
  return newFiles;
}
function convertPreview(){
  var jsMinOpts = config.jsMin.options;
  var cssMinOpts = config.cssMin.options;

  jsMinOpts.sourceMap = true;
  delete jsMinOpts.gzip;
  delete jsMinOpts.compress;  
  delete cssMinOpts.compress;
  delete cssMinOpts.modifyVars["x-imgPath"];
  delete cssMinOpts.modifyVars["x-cssPath"];
}
function convertDestDir(dir){
  if(!dir)return;

  destDir = dir;
  destJsDir = path.join(destDir.root,destDir.js);
  destCssDir = path.join(destDir.root,destDir.css);
  destImgDir = path.join(destDir.root,destDir.img);
}
function convertion(){ //转换配置文件
  var newConfig = {};

  for(var k in config){
    var item = _.clone(config[k]),
        key = k, isConvert;

    switch(k){
      case "concat":        
        item.options = item.options||{};
        item.options.process = parseJsText;
        item.files = convertFiles(item.files,{src: srcJsDir,dest: destJsDir});
        isConvert = true;
        break;
      case "jsMin":
        key = 'uglify';
        item.files = convertFiles(item.files,{src: destJsDir,dest: destJsDir,needConvertFileName: true});
        isConvert = true; 
        break;
      case "cssMin":
        key = 'less';
        item.files = convertFiles(item.files,{src: srcCssDir,dest: destCssDir,needConvertFileName: true});        
        isConvert = true;
        break;
      default:
        newConfig[key] = item;
        break;
    }

    if(isConvert){
      convertionFiles[k] = item.files;
      newConfig[key] = { build: item };
    }    
  }

  newConfig.clean = {
    init: [destJsDir+'/*',destCssDir+'/*',destImgDir+'/*'],
    //init: [destDir.root+'/*','!'+destDir.root+'index.htm'],
    deploy: [destJsDir+'/*','!'+destJsDir+'/*'+timeStamp+'*']
  };
  newConfig.copy = {
    statics: {
      files: [
        {expand: true, cwd: srcImgDir, src: '**', dest: path.join(destImgDir,'/'), rename: function(dest, fileName) {
          var need;
          config.images.rename.forEach(function(name){
            if(fileName.toLowerCase()==name.toLowerCase()){
              need = true;
              return;
            }
          });
          if(need)
            return path.join(dest, convertFileName(fileName));
          return path.join(dest, fileName);
        }},
        {expand: true, cwd: path.join(srcDir.root,'datepicker'), src: '**', dest: path.join(destDir.root,'datepicker')},
        //{expand: true, cwd: path.join(srcDir.root,'pdfview'), src: '**', dest: path.join(destDir.root,'pdfview')},
        {expand: true, cwd: path.join(srcCssDir,'font'), src: '**', dest: path.join(destCssDir,'font')},        
        //{src: path.join(destCssDir,"core*.css"), dest: path.join(destCssDir,"core.css"), filter: 'isFile'}
      ]
    },
    htmlTpl:{
      options: {
        process: function (content, srcpath) {
          return content
                  .replace(/css\/core.css/g, config.staticSiteUrl+'/css/'+convertFileName('core.css'))
                  .replace(/js\/core.js/g, config.staticSiteUrl+'/js/'+convertFileName('core.jsz'))
                  .replace(/js\/jquery.js/g, config.staticSiteUrl+'/js/'+convertFileName('jquery.plugins.jsz'))
                  .replace(/js\/callserver.js/g, config.staticSiteUrl+'/js/'+convertFileName('callserver.jsz'))
                  .replace(/js\/application.js/g, config.staticSiteUrl+'/js/'+convertFileName('application.jsz'))
                  .replace(/\/favicon.ico/g, config.wwwSiteUrl+'/favicon.ico')
                  .replace(/aboutMe.html/g, config.wwwSiteUrl+'/aboutMe.html')
                  .replace(/service.html/g, config.wwwSiteUrl+'/service.html')
                  .replace(/privacy.html/g, config.wwwSiteUrl+'/privacy.html');
                  //.replace(new RegExp("(href[\s]*=[\s]*[\"\'])([^:.]*?)([\"\'])","img"),("$1"+config.wwwSiteUrl+"$2$3"));
        }
      },
      expand: true, cwd: path.join(srcDir.root,srcDir.htmlTpl), src: '*', dest: wwwDir||destDir.root, flatten: true, filter: 'isFile'
    }
  }; 

  newConfig.compress = {
    gzip: {
      options: {
        mode: 'gzip'
      },
      expand: true,
      cwd: destJsDir,
      src: convertionFiles.jsMin.filter(function(file){
        return file.gzip;
      }).map(function(file){
        return file._dest;
      }),
      dest: destJsDir,
      ext: '.jsz'
    },
    srcSite: { //静态资源
      options: {        
        archive: destDir.root+'s.infobox.com.zip'
      },
      expand: true, 
      cwd: destDir.root, 
      src: [destDir.css+'/**',destDir.img+'/**','datepicker/**'].concat(convertionFiles.jsMin.map(function(file){          
        return destDir.js+'/'+file._dest+(file.gzip?'z':'');
      }))
    },
    wwwSite: {
      options: {
        archive: destDir.root+'www.infobox.com.zip'
      },      
      files: [
        {expand: true, cwd: destImgDir, src: 'favicon.ico'}
      ]
    }
  };

  return newConfig;
}

function genScriptTags(type){
  var getTag = function(name, dir){
    return '<script src="'+(dir||'')+path.join(destDir.js, name)+'" type="text/javascript"></script>'+endLine;
  }

  var previewStr='',deployStr='';
  config.jsMin.files.forEach(function(file){
    var actualName = convertFileName(file.dest+(ifDeploy?'z':(file.gzip?'z':''))),
        _previewStr = getTag(actualName),
        _deployStr = getTag(actualName,config.staticSiteUrl+'/'),
        _isPreviewFile = file.mode=='previewFile';

    if(type==1){
      // if(file.dest!='application.js'){
      //    previewStr+= _previewStr;
      //   deployStr+= _deployStr;
      // }
      //if(_isPreviewFile){
        switch(file.dest){
          case 'callserver.js':
          case 'application.js':
            break;
          default:
            previewStr+= _previewStr;
            deployStr+= _deployStr;
            break;
        }
      //}
    }
    else{
      if(!_isPreviewFile){
        if(!(ifPreviewServer&&file.dest=='callserver.js'))
          previewStr+= _previewStr;
        deployStr+= _deployStr;
      }
    }
  });

  return {
    preview: previewStr,
    deploy: deployStr
  };
}
function genCssTags(){
  var str = '<link href="{url}" media="screen" rel="stylesheet" type="text/css" />'+endLine,
      url = path.join(destDir.css,'core'+timeStamp+'.css');

  return {
    preview: helper.parseTpl(str,{url: url}),
    deploy: helper.parseTpl(str,{url: config.staticSiteUrl+'/'+url})    
  };
}

function genPreviewHtml(){
  fs.mkdir(destDir.root);

  var previewFileDir = path.join(destDir.root,"index.html");
  console.log('File '+previewFileDir+' created');

  helper.rewriteFile("preview.tpl.html", previewFileDir,{
    timeStamp: timeStamp,
    scriptTags: genScriptTags().preview,
    cssTags: genCssTags().preview
  });
}

function genPreviewFileHtml(){
  fs.mkdir(destDir.root);

  var previewFileDir = path.join(serviceDir+"/public/"||destDir.root,"previewFile.html");  
  console.log('File '+previewFileDir+' created');

  helper.rewriteFile("previewFile.tpl.html", previewFileDir,{
    timeStamp: timeStamp,
    scriptTags: ifDeploy?genScriptTags(1).deploy:genScriptTags(1).preview,
    cssTags: ifDeploy?genCssTags().deploy:genCssTags().preview
  });
}

function genServerTplFile(){  
  var scriptTags = genScriptTags(),
      cssTags = genCssTags(),
      files = [
        {src: '_script_tags_pro.html.erb', type:'script'},
        {src: '_css_tags_pro.html.erb', type:'css'}        
      ];
  if(ifPreviewServer){
    files.push({src: '_script_tags_dev.html.erb', type:'script_dev'});
    files.push({src: '_css_tags_dev.html.erb', type:'css_dev'});
  }

  files.forEach(function(file){    
    var filePath = path.join(destDir.root,destDir.template,file.src), text;
    switch(file.type){
      case 'script':
        text = scriptTags.deploy;
        //统计代码
        text += '<script>var _hmt = _hmt || [];(function() {  var hm = document.createElement("script");  hm.src = "//hm.baidu.com/hm.js?e13bcfddcafb302f480d598555bd6478";  var s = document.getElementsByTagName("script")[0];   s.parentNode.insertBefore(hm, s);})();</script>';
        break;
      case 'script_dev':
        text = scriptTags.preview;
        break;
      case 'css':
        text = cssTags.deploy;
        break;
      case 'css_dev':
        text = cssTags.preview;
        break;
    }

    text&&fs.writeFileSync(filePath, text);
  });
}

module.exports = function(grunt) {
  ifDeploy = grunt.option('deploy');  
  ifPreview = !ifDeploy;
  ifPreviewClient = ifPreview&&grunt.option('client');
  ifPreviewServer = !ifPreviewClient&&grunt.option('server');  
  ifPreviewServer&&convertDestDir(config.serverDestDir);
  ifDeploy&&convertDestDir(config.deployDestDir);
  if(ifPreview&&!ifPreviewServer)
    ifPreviewClient = true;
  if(ifDeploy){
    wwwDir = path.join(destDir.root,destDir.www); 
    serviceDir = path.join(destDir.root,destDir.service); 
  }
  var newConfig = convertion(); //console.log(newConfig);  
  grunt.initConfig(newConfig);

  ifPreview&&convertPreview();
  ifPreviewClient&&genPreviewHtml();
  (ifPreviewServer||ifDeploy)&&genServerTplFile();
  genPreviewFileHtml();

  //加载任务
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  
  grunt.registerTask('nia','nia build', function(){
    grunt.task.run('clean:init');
    grunt.task.run('concat');
    grunt.task.run('less');
    grunt.task.run('uglify');
    grunt.task.run('copy:statics');
    grunt.task.run('copy:htmlTpl');
    grunt.task.run('compress:gzip');
    if(ifDeploy){      
      grunt.task.run('clean:deploy');
    }
  });
};