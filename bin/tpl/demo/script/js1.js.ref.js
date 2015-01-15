(function () {var t_aaa = new IX.ITemplate({tpl: [
'aaaaa',
	'<tpl id=\'bbb\'>',
		'<div>111111111</div>',
	'</tpl>',
'bbbbb',
'']});

ccccc = 1;
dddddd = 2;
if(a<b) {
  alert("<dddd>");
}

IX.setNS('Entos.Tpl.www', t_aaa);
IX.setNS('Entos.Tpl.zwm', new IX.ITemplate({tpl:t_aaa.getTpl('bbb')}));
})();