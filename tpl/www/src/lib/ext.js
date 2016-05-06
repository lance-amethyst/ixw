(function($) {
$.extend($.fn, {
	swapClass: function(c1, c2) {
		var c1Elements = this.filter('.' + c1);
		this.filter('.' + c2).removeClass(c2).addClass(c1);
		c1Elements.removeClass(c1).addClass(c2);
		return this;
	},
	replaceClass: function(c1, c2) {
		return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
	},
	hoverClass: function(className) {
		className = className || "hover";
		return this.hover(function() {
			$(this).addClass(className);
		}, function() {
			$(this).removeClass(className);
		});
	}
});
})(jQuery);