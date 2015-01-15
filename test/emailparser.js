(function(){
	try{
	IX.ns("Entos");
	}catch(ex){}

	var script_expr = /<[\s]*?script[^>]*?>[\s\S]*?<[\s]*?\/[\s]*?script[\s]*?>/ig;
	var style_expr = /<[\s]*?style[^>]*?>[\s\S]*?<[\s]*?\/[\s]*?style[\s]*?>/ig;
	var title_expr = /<[\s]*?title[^>]*?>[\s\S]*?<[\s]*?\/[\s]*?title[\s]*?>/ig;
	var map_expr = /<[\s]*?map[^>]*?>[\s\S]*?<[\s]*?\/[\s]*?map[\s]*?>/ig;
	//var css_expr = /[^\/\>\{\}\d]([#\.\w-]+)[\s]*[\{]/g;
	//var css_expr = /(body|html|\*)[\s]*[\{]/ig;
	var css_expr = /[^\/\>\)\{\}\d]([#\.\w\s:-]*?)[\{,]/ig;
	var filter_expr = /<[\/\s]*(!doctype|html|meta|link|head|base|body|iframe|title)[^>]*>/ig;
	var lTrim_expr = /(^\s*)/g;
	
	var lTrim = function(str){
		return str.replace(lTrim_expr,'');
	};
	
	var safeStyle = function(html, selector){
		return html.replace(css_expr,function($0,$1){			
			$0 = lTrim($0);
			$1 = lTrim($1).toLowerCase();
			switch($1){
				case "*":
				case "html":
				case "body":
					return selector+"{";
			}
			
			var fc = $0.charAt(0);
			if(fc!=='#'&&isNaN(fc))
				return selector+" "+$0;
			return $0;
		});
		
		//return html.replace(css_expr,selector+"{");
	};
	
	/**
	* html: 
	* selector: css selector for <style>
	*/
	var safeHtml = function(html,selector){		
		return html.replace(script_expr,'')
				   .replace(title_expr,'')
				   .replace(filter_expr,'')
				   .replace(map_expr,'')
				   .replace(style_expr,'');
		/*return html.replace(script_expr,'')
				   .replace(title_expr,'')
				   .replace(filter_expr,'')
				   .replace(map_expr,'')
				   .replace(style_expr,function($0,$1){
						return safeStyle($0,selector);
				    });*/
	};

	//TODO: 给A标签增加target="_blank"
	//TODO: 过滤掉所有的事件 如 click, keyup, ...
	

	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
		exports.safeHtml = safeHtml;
	}else{
		if(window.Entos)
			Entos.safeHtml = safeHtml;
		else window.safeHtml = safeHtml;
	}
})();
(function(){
	var capitalize=function(_s){
	    return _s.charAt(0).toUpperCase() + _s.substring(1).toLowerCase();
	};
	var camelize=function(s){
	        return s.replace(/\-(\w)/ig, 
	        function(B, A) {
	            return A.toUpperCase();
	        });
	};
	var getStyle = function(elem,styles){
        var value, _document = elem.ownerDocument;
        if(styles == "float"){
             _document.defaultView ? styles = 'float' /*cssFloat*/ : styles='styleFloat';
        }
        value=elem.style[styles] || elem.style[camelize(styles)];
        if(!value){
             if (_document.defaultView && _document.defaultView.getComputedStyle) {
                var _css=_document.defaultView.getComputedStyle(elem, null);
                value= _css ? _css.getPropertyValue(styles) : null;
             }else{
                if (elem.currentStyle){
                    value = elem.currentStyle[camelize(styles)];
                }
             }
        }
        if(value=="auto" && (styles == "width" || styles == "height") && elem.style.display!="none"){
            value=elem["offset"+capitalize(styles)]+"px";
        }
        if(styles == "opacity"){
            try {
                value = elem.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                value =value/100;
            }catch(e) {
                try {
                    value = elem.filters('alpha').opacity;
                } catch(err){}
            }
            
        }
        return value=="auto" ? null :value;
    };
	/*
		display=none remove
		visible=false clear context
		childNodes.length == 0 && opacity=1||size==0  remove

	*/
	var ____EntosEmailParse = function ($dom, _sysOp) {
		function parse(_dom){
			if(!_dom) return;
			if(!_dom.tagName){
				if(_dom.nodeType == 8 || _dom.nodeName == "#comment") _dom.parentNode.removeChild(_dom);
				return;
			}
			if(_dom.tagName.toLowerCase() == "style") return;

			if(getStyle(_dom, "display") == "none"){
				_dom.parentNode.removeChild(_dom);
				return;
			}
			var visibility = getStyle(_dom, "visibility");
			_dom.removeAttribute("style");
			_dom.removeAttribute("width");
			_dom.removeAttribute("height");
			_dom.removeAttribute("align");
			//_dom.removeAttribute("usemap");
			_dom.removeAttribute("border");
			_dom.removeAttribute("cellpadding");
			_dom.removeAttribute("cellspacing");
			_dom.removeAttribute("class");
			if(visibility == "hidden"){
				_dom.innerHTML = "";
				return;
			}

			var childNodesNum = _dom.childNodes.length;

			for(var i = childNodesNum - 1; i >= 0; i --){
				parse(_dom.childNodes[i]);
			}
			childNodesNum = _dom.childNodes.length;

			if(childNodesNum == 0 && (getStyle(_dom, "opacity") == 1)){
				_dom.parentNode.removeChild(_dom);
				return;
			}

			if(_dom.offsetLeft < 0 && _dom.offsetLeft*-1 > _dom.offsetWidth
				|| _dom.offsetTop < 0 && _dom.offsetTop * -1 > _dom.offsetHeight)
				_dom.parentNode.removeChild(_dom);
		}

		parse($dom);
	};

	var parse_for_nodejs = function(_html, _sysOp){
		var $ = require("jquery").create();
		var safeHtml = require("./safeHtml").safeHtml;
		var $html = $("<div>" + safeHtml(_html, _sysOp&&_sysOp.className || "") + "</div>").appendTo("body");

		____EntosEmailParse($html[0], _sysOp);

		return $html.html();
	};

	var parse_for_navigator = function(_html, _sysOp){
		var _document = document.createDocumentFragment();
		var _div = document.createElement("div");

		_document.appendChild(_div);

		_div.innerHTML = safeHtml(_html, _sysOp&&_sysOp.className || "");

		____EntosEmailParse(_div, _sysOp);

		return _div.innerHTML;

	};
	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
		exports.EmailParse = parse_for_nodejs;
	}else{
		try{
			IX.ns("Entos.HtmlLib");
			Entos.HtmlLib.EmailParse = parse_for_navigator;
		}catch(ex){
			window.EmailParse = parse_for_navigator;	
		}
	}
})();
