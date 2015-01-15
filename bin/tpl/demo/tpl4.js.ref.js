(function () {var t_aaa = new IX.ITemplate({tpl: [
	'eqweqwewqe',
	'<tpl id=\'bbb\'>',
		'12121212',
		
		'<tpl id=\'ccc\'>',
			'222222',
			'<div id = \'1\'></div>',
		'</tpl>',',\'\',',
		'<div></div>',
	'</tpl>',',\'\',',
	'<tpl id=\'e\'>',
		'12121212',
		
		'<tpl id=\'f\'>',
			'222222',
			'<div id = \'1\'></div>',
		'</tpl>',',\'\',',
		'<div></div>',
	'</tpl>',',\'\',',
'<a></a>',
'']});

IX.setNS('Entos.Tpl.www', t_aaa);
IX.setNS('Entos.Tpl.www1', new IX.ITemplate({tpl:t_aaa.getTpl('bbb')}));
IX.setNS('Entos.Tpl.www2', new IX.ITemplate({tpl:t_aaa.getTpl('bbb.ccc')}));
IX.setNS('Entos.Tpl.ddd', new IX.ITemplate({tpl:t_aaa.getTpl('e')}));
IX.setNS('Entos.Tpl.fff', new IX.ITemplate({tpl:t_aaa.getTpl('e.f')}));
})();