(function () {var t_aaa = new IX.ITemplate({tpl: [
	'ewqewqewqe',

	'<tpl id=\'ccc\'>',
		'qwewqewqeeeeeeeeeeeee',
	'</tpl>',
'']});

var t_bbb = new IX.ITemplate({tpl: [
	'qwewqewqeeeeeeeeeeeee',
	t_aaa.getTpl(),
	t_aaa.getTpl('ccc'),
'']});

var t_bbb = new IX.ITemplate({tpl: [
	'qwewqewqeeeeeeeeeeeee',
	Entos.Tpl.www.aaa.getTpl(),
'']});

var t_bbb = new IX.ITemplate({tpl: [
	'qwewqewqeeeeeeeeeeeee',
	Entos.Tpl.www.aaa.renderData('', {}),
'']});
})();