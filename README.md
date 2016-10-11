# IXW project

IXW is a set of Web development framework base on IX library.

There are 2 mode for create a new project:
   "pure" -- only Web Frontend 
   "mixed" -- Both Web Frontend and Backend (need supported by shell, backend is based on Node.js)
Default, "pure" mode is used.

To create a web project, clone this repository in your workspace and do as following:

##1. run `npm install` to load dependency packages
##2. run `node config` to create project configuration file : ixw-config.js;
    also you can create it by modify the template file : config-template.js;
    Following is an examples :

<pre>
  module.exports = {
    // optional, default "pure"
    // 		"pure" -- only Web Frontend 
    // 		"mixed" -- Both Web Frontend and Backend (supported by shell)
    type : "pure",
    //REQUIRED!! new project name,
    name : "xyz",
    // optional, default is upperCase of project's name 
    ns : "XYZ",
    // optional, default using project's name as folder name 
    //		and create it under parent directory of current path
    path : "../xyz"
  };
</pre>

##3. run `grunt` to create the project. Also your can run `grunt pure` or `grunt mixed` to create with specified mode. 




