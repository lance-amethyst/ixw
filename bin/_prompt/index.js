var util = require('util');
var fs = require('fs');

var content = fs.readFileSync("promption.txt");
var lines = content.split("\n");
var promptHT = {}, key = "", value=[];
for (var i=0; i < lines.length; i++){
	var line = lines[i];
	if (line.substring(0, 3) == "## "){
		if (!IX.isEmpty(key))
			promptHT[key] = value.join("\n");
		key = line.subtring(3).trim();
		value = [];
	} else {
		value.push(line);
	}
}
if (!IX.isEmpty(key))
	promptHT[key] = value.join("\n");

IX.ns("IXW.Tools");
IXW.Tools.getPromption = function(key){
	return promptHT[key]
};