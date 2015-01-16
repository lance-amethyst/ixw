(function () {var t_aaa = new IX.ITemplate({tpl: [
	'eqweqwewqe',
	'<tpl id=\'bbb\'>',
		'12121212',
		'<div></div>',
	'</tpl>',',\'\',',
'<a></a>',
'']});

IX.setNS('Entos.Tpl.www', t_aaa);
IX.setNS('Entos.Tpl.wwwz', new IX.ITemplate({tpl:t_aaa.getTpl('bbb')}));
})();