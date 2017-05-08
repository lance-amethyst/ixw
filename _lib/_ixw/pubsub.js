(function () {
var fnHT = {};
var evtHT = IX.I1ToNManager();

IX.ns('IXW');
IXW.publish = function (evtname, params) {
	IX.iterate(evtHT.get(evtname), function (key) {
		var fn = fnHT[key];
		if (!IX.isFn(fn))
			return;
		fn(params);
	});
};
IXW.subscribe = function (evtname, fn) {
	var key = evtname + (new Date()).getTime();

	fnHT[key] = fn;
	evtHT.put(evtname, key);
	return {
		unsubscribe: function () {
			fnHT[key] = undefined;
			evtHT.remove(evtname, key);
		}
	};
};
}());