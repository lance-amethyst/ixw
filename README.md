# IXW project

IXW is a set of Web development framework base on <a href="https://github.com/lance-amethyst/IX">IX library</a>. About how it works, see <a href="doc/idea.md">the idea of IXW</a> for more detail(Sorry, only Chinese language).

There are 2 modes for create a new project:
   "pure" -- only Web Frontend 
   "mixed" -- Both Web Frontend and Backend (need supported by shell, backend is based on Node.js)
Normally, "pure" mode is used.

To create a web project, clone this repository in your workspace and do as following:

##1. run `npm install` to load dependency packages
##2. run `node config` to create project configuration file : ixw-config.js;
    also you can create it by modify the template file : config-template.js;
    Following is an example :

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

##3. run `grunt` to create the project.
Also your can run `grunt pure` or `grunt mixed` to create with specified mode. 

##4. after created, refer the <a href="doc/architecture.md">development statements</a> to know how to develop on it.



