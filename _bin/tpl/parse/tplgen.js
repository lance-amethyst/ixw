var fs = require("fs");
var Parser = require("jison").Parser;
console.info("start");
var grammar = fs.readFileSync("tpl_parser.jison", "utf8");
console.info(grammar);
var parser = new Parser(grammar);

// generate source, ready to be written to disk
var parserSource = parser.generate({moduleName: "IXTplParser"});
fs.writeFileSync("../lib/parser.js", parserSource);
