(function(){
IX.ns("IXW");
IXW.startup = function(fn){
	window[IXW_NS].init = fn;
};
IXW.ready(IXW_NS + ".init", function(fn){
	if (!IX.isFn(fn))
		alert("Can't initialize page for not found init function : " + fn);
	else 
		fn();
});
})();