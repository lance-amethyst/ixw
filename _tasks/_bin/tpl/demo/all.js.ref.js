(function () {var t_aaa = new IX.ITemplate({tpl: [
	'ewqewqewqe请问恶趣味额',

	'<tpl id=\'d\'>',
		'1111111111请问恶趣味额111',
	'</tpl>',
'']});


	var a = "<tpl></tpl>";


var t_bbb = new IX.ITemplate({tpl: [
	'qwewqewqeeeeeeeeeeeee',
	t_aaa.getTpl(),'我去恶趣味额',
	'<script>ewqewqe</script>',
'']});




	var a = "<tpl请问恶趣味额></tpl>";
	var b = "<" + "script我去恶趣味额></" + "script>";


var t_bbb = new IX.ITemplate({tpl: [
	'qwewqewqeeeeeeeeeeeee',
	'<tpl id=\'e\'>',
		Entos.Tpl.www.aaa.getTpl(),
	'</tpl>',
	Entos.Tpl.www.aaa.getTpl(),
'']});




	var a = "<tpl></tpl>";

IX.setNS('Entos.Tpl.w', new IX.ITemplate({tpl:t_aaa.getTpl('d')}));
IX.setNS('Entos.Tpl.w1', new IX.ITemplate({tpl:t_bbb.getTpl('e')}));
})();