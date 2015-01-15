(function () {var t_pages = new IX.ITemplate({tpl: [
	'<div></div>',
'']});

var t_users = new IX.ITemplate({tpl: [
	'<table class = \'list\'>',
		'<tpl id=\'context\'>',
			'<tr><td>{name}</td></tr>',
		'</tpl>',
	'</table>',
	Entos.Tpl.pages.renderData('', {}),
'']});


	var userList = function(){
		var tpl = t_users;
		tpl.renderData();
	};

IX.setNS('Entos.Tpl.pagination', t_pages);
IX.setNS('Entos.Tpl.list', new IX.ITemplate({tpl:t_users.getTpl('context')}));
})();