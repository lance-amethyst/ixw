var wwwSiteUrl = "http://www.infoboxme.com";
var staticSiteUrl = "https://s.infoboxme.com";
var avatarSiteUrl = "https://s1.infoboxme.com";
var serviceSiteUrl = "https://service.infoboxme.com";
// var wwwSiteUrl = "http://www1.infoboxme.com";
// var staticSiteUrl = "https://s2.infoboxme.com";
// var avatarSiteUrl = "https://s11.infoboxme.com";
// var serviceSiteUrl = "https://service1.infoboxme.com";
var timeStamp = +new Date;

module.exports = {  
  concat: { //文件合并
    files: [
      {
        src: 'lib/ixutils.js',
        dest: 'ixbase.js'
      },
      {
        cwd: "../proto",
        src: 'global-const.js',
        dest: 'global-const.js'
      },
      {
        cwd: "jquery",
        src: "jquery.js",
        dest: "jquery.js"
      },
      {
        cwd: "jquery",
        src: 'jquery.ui.1_8_13.core.js,jquery.ui.1_8_13.widget.js,jquery.ui.1_8_13.mouse.js,jquery.ui.1_8_13.draggable.js,jquery.ui.1_8_13.sortable.js,jquery.ui.1_8_13.droppable.js,jquery.ui.1_8_13.resizable.js,jquery.ui.1_8_13.effects.core.js,jquery.ui.1_8_13.effects.blind.js,jquery.ui.1_8_13.effects.drop.js',
        dest: 'jquery.ui.js'
      },
      {
        cwd: "jquery",
        src: 'jquery.treeview.js,jquery.chosen.js,jq.selection.js,jq.textarea.autogrow.js,jq.textarea.charOffset.js,jcarousellite.min.js,jquery.mousewheel.min.js,jquery.iviewer.js,jquery.inputEmail.js',
        dest: 'jquery.plugins.js'
      },
      {
        cwd: "entos",
        src: 'typedef.js,lib/eventRoute.js,constants/dataType.js,fileOperation/fileOperation.js,lib/filelist.js,../pymatch/pymatch.js,lib/match.js,lib/publicDataCache.js,lib/topics.js,lib/usermanager.js,lib/routeEngine.js,lib/common.js,../lib/pushstream.js,../channel/pushstream.js,../channel/channel.js,../emotion/emotionBase.js,../editor/meformat.js,fileUploader/fileUploader.js,lib/combo.js,../datepicker/WdatePicker.js,lib/input.js,lib/storage.js,lib/msgNotice.js,lib/dialog.js.html,lib/brief.js.html,lib/ui.js,lib/guide.js.html', 
        dest: 'lib.js'
      },
      {
        cwd: 'entos',
        src: '../ui/ixui_base.js.html,../emotion/emotion.js.html,../editor/med.js.html,lib/cmps.js.html,lib/list.js.html,lib/slide.js.html,../im/imFile.js,../im/im.js,lib/format.js',
        dest: 'ixui.js'
      },
      {
        cwd: "entos/feedLib",
        src: 'view.js.html,core.js,model.js,handler.js,cmps.js,../feed/cmps.js.html',
        dest: 'feedLib.js'
      },
      {
        cwd: "entos/editor",
        src: 'editor.cmps.js,editor.lib.js,editor.appendix.js,editor.areaMgr.js,editor.postMgr.js,editor.js',
        dest: 'mbEditor.js.html'
      },      
      {
        cwd: "entos",
        src: 'layout/action.js,layout/init.js,subpage/init.js,sorry/init.js,task/cmps.js.html,task/taskcombo.js.html',
        dest: 'base.js.html'
      },
      {
        cwd: "entos",
        src: 'route.js,init.js.html',
        dest: 'start.js'
      },
      {
        cwd: "entos/entry",
        src: 'entry.js,index.js,recoverPwd.js',
        dest: 'entry.js.html'
      },
      {
        cwd: "entos/box",
        src: 'cmps.js,listPanel.js,detailPanel.js,controlPanel.js,init.js',
        dest: 'box.js.html'
      },
      {
        cwd: "entos/profile",
        src: 'firstSetProfile.js,controlPanel.js,init.js',
        dest: 'profile.js.html'
      },
      {
        cwd: "entos/project",
        src: 'cmps.js,init.js,controlPanel.js',
        dest: 'project.js.html'
      },
      {
        cwd: "entos/search",
        src: 'init.js',
        dest: 'search.js.html'
      },
      {
        cwd: "entos/lib",
        src: 'pdfviewer.js,lightbox.js',
        dest: 'preview.js.html'
      },
      {
        cwd: "pdfview",
        src: 'pdf.js,compatibility.js,l10n.js,pdfviewer.js', 
        dest: 'pdf.js'
      },
      {
        cwd: "../proto",
        src: 'global-url.js,global-callserver-*.js',
        dest: 'global-callserver.js'
      },    
      {
        cwd: "../proto",
        src: 'test.js',
        dest: 'test.js'
      }
    ]
  },
  jsMin: { //js压缩合并
    options:{
      compress: {
        drop_console: true
      },
      separator: ';',
      //report: 'gzip',
      //sourceMap: true
    },
    files: [
      {
        src: 'ixbase.js,global-const.js,jquery.js,preview.js.html,lib.js,ixui.js',
        dest: 'core.js'
      },
      {
        src: 'jquery.ui.js,jquery.plugins.js',
        dest: 'jquery.plugins.js'
      },
      {
        src: 'global-callserver.js',
        dest: 'callserver.js',
        //gzip: true
      },
      {
        src: 'feedLib.js,mbEditor.js.html,base.js.html,start.js,entry.js.html,box.js.html,profile.js.html,project.js.html,search.js.html',
        dest: 'application.js',
        //gzip: true
      },
      {
        src: 'pdf.js',
        dest: 'preview.js',
        //gzip: true,
        mode: "previewFile" //不自动加载到网页
      }
    ]
  },
  cssMin: { //css压缩合并
    options: {
      compress: true,
      //report: 'gzip', //'min'/'gzip',
      modifyVars: {
        // "x-imgPath": '"'+staticSiteUrl+'/images/"',
        // "x-cssPath": '"'+staticSiteUrl+'/css/"',
        "x-timeStamp": '"'+timeStamp+'"'
      }
    },    
    files: [
      {src: 'core.less', dest: 'core.css'}
    ]
  },
  images: {
    rename: ['picmap.png','ixicon.png','guidepic.png'] //需要加时间戳的图片
  },

  srcDir: { //源目录
    root: "../../web_home/src/",
    js: "",
    css: "css",
    img: "images",
    htmlTpl: "../proto/htmlTpl"
  },
  destDir: { //客户端发布目录
    root: "../../web_home/public/",
    js: "js",
    css: "css",
    img: "images"    
  },
  serverDestDir: { //服务器发布目录
    root: "../../../entos/public/",
    js: "js",
    css: "css",
    img: "images",
    serverJs: "serverJs",
    template: '../app/views/template' //ruby模板文件
  },
  deployDestDir: { //生产环境发布目录
    root: "../../../release_infoboxme/production/static",
    js: "js",
    css: "css",
    img: "images",
    template: '../service/app/views/template', //ruby模板文件
    www: '../www',
    service: '../service'
  },

  wwwSiteUrl: wwwSiteUrl,
  staticSiteUrl: staticSiteUrl,
  serviceSiteUrl: serviceSiteUrl,
  avatarSiteUrl: avatarSiteUrl,
  timeStamp: timeStamp
};