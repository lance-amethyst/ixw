(function () {
/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var IXTplParser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"p":3,"stmts":4,"stmt":5,"tpl_stmt":6,"script_stmt":7,"TPL":8,"attrs":9,">":10,"tpl_elements":11,"ETPL":12,"SCRIPT":13,"texts":14,"ESCRIPT":15,"TEXT":16,"attr":17,"NAME":18,"=":19,"STR":20,"tpl_element":21,"note_stmt":22,"use_stmt":23,"USE":24,"NOTE":25,"-->":26,"$accept":0,"$end":1},
terminals_: {2:"error",8:"TPL",10:">",12:"ETPL",13:"SCRIPT",15:"ESCRIPT",16:"TEXT",18:"NAME",19:"=",20:"STR",24:"USE",25:"NOTE",26:"-->"},
productions_: [0,[3,0],[3,1],[4,1],[4,2],[5,1],[5,1],[6,5],[7,3],[14,1],[14,2],[9,1],[9,2],[17,3],[11,1],[11,2],[21,1],[21,1],[21,1],[21,1],[23,3],[22,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 2: return $$[$0];
break;
case 3: this.$ = [$$[$0]]; 
break;
case 4: this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 7: this.$ = {type:"tpl"}; this.$.text= $$[$0-4];this.$.endText= $$[$0]; for(var p in $$[$0-3]) if(p!="export") this.$.text += " " + $$[$0-3][p].text; this.$.text+=">"; this.$.attrs = $$[$0-3]; this.$.tpls = $$[$0-1]; this.$.first_line = _$[$0-4].first_line; this.$.first_column = _$[$0-4].first_column; this.$.last_line = _$[$0].last_line; this.$.last_column = _$[$0].last_column;
break;
case 8: this.$ = $$[$0-1]; this.$["type"] = "script"; this.$.first_line = _$[$0-2].first_line; this.$.first_column = _$[$0-2].first_column; this.$.last_line = _$[$0].last_line; this.$.last_column = _$[$0].last_column; 
break;
case 9: this.$={}; this.$.text=$$[$0]; 
break;
case 10: this.$=$$[$0-1]; $$[$0-1].text=$$[$0-1].text+$$[$0]; 
break;
case 11: this.$ = $$[$0]; 
break;
case 12: this.$ = $$[$0-1]; for(var p in $$[$0]) this.$[p] = $$[$0][p]; 
break;
case 13: this.$ = {}; this.$[($$[$0-2]+"").toLowerCase()] = {text: $$[$0-2]+'='+$$[$0], value: !$$[$0]?"":$$[$0][0]=="'"||$$[$0][0]=="\""?$$[$0].substr(1,$$[$0].length-2):$$[$0]}; 
break;
case 14: this.$ = [$$[$0]]; 
break;
case 15: this.$ = $$[$0-1]; var last=this.$[this.$.length-1]; if(last!=null && last.type=="text" && $$[$0].type=="text" && !last.text.match(/((\n\s*)|(\r\n\s*))$/) &&  !$$[$0].text.match(/^((\n\s*)|(\r\n\s*))/)) this.$[this.$.length-1].text+=$$[$0].text; else this.$.push($$[$0]); 
break;
case 16: this.$ = {type:"text"}; this.$.text = $$[$0]; 
break;
case 17: this.$ = $$[$0]; 
break;
case 18: this.$ = $$[$0]; 
break;
case 19: this.$ = $$[$0]; 
break;
case 20: this.$ = {type: 'use'}; this.$.attrs = $$[$0-1];  
break;
case 21:  this.$ = $$[$0-1]; this.$["type"] = "note"; 
break;
}
},
table: [{1:[2,1],3:1,4:2,5:3,6:4,7:5,8:[1,6],13:[1,7]},{1:[3]},{1:[2,2],5:8,6:4,7:5,8:[1,6],13:[1,7]},{1:[2,3],8:[2,3],13:[2,3]},{1:[2,5],8:[2,5],13:[2,5]},{1:[2,6],8:[2,6],13:[2,6]},{9:9,17:10,18:[1,11]},{14:12,16:[1,13]},{1:[2,4],8:[2,4],13:[2,4]},{10:[1,14],17:15,18:[1,11]},{10:[2,11],18:[2,11]},{19:[1,16]},{15:[1,17],16:[1,18]},{15:[2,9],16:[2,9],26:[2,9]},{6:23,8:[1,6],11:19,16:[1,21],21:20,22:22,23:24,24:[1,26],25:[1,25]},{10:[2,12],18:[2,12]},{20:[1,27]},{1:[2,8],8:[2,8],13:[2,8]},{15:[2,10],16:[2,10],26:[2,10]},{6:23,8:[1,6],12:[1,28],16:[1,21],21:29,22:22,23:24,24:[1,26],25:[1,25]},{8:[2,14],12:[2,14],16:[2,14],24:[2,14],25:[2,14]},{8:[2,16],12:[2,16],16:[2,16],24:[2,16],25:[2,16]},{8:[2,17],12:[2,17],16:[2,17],24:[2,17],25:[2,17]},{8:[2,18],12:[2,18],16:[2,18],24:[2,18],25:[2,18]},{8:[2,19],12:[2,19],16:[2,19],24:[2,19],25:[2,19]},{14:30,16:[1,13]},{9:31,17:10,18:[1,11]},{10:[2,13],18:[2,13]},{1:[2,7],8:[2,7],12:[2,7],13:[2,7],16:[2,7],24:[2,7],25:[2,7]},{8:[2,15],12:[2,15],16:[2,15],24:[2,15],25:[2,15]},{16:[1,18],26:[1,32]},{10:[1,33],17:15,18:[1,11]},{8:[2,21],12:[2,21],16:[2,21],24:[2,21],25:[2,21]},{8:[2,20],12:[2,20],16:[2,20],24:[2,20],25:[2,20]}],
defaultActions: {},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1: this.begin('Tpl'); this.begin('Tag'); return 8; 
break;
case 2:/* skip whitespace */
break;
case 3: this.begin('Script'); return 13; 
break;
case 4: this.popState(); return 15; 
break;
case 5: return 18; 
break;
case 6: return 19; 
break;
case 7: return 20; 
break;
case 8: return 20; 
break;
case 9: this.popState(); return 10; 
break;
case 10: this.popState(); return 26; 
break;
case 11: this.begin('Note'); return 25; 
break;
case 12: this.popState(); return 12; 
break;
case 13: this.begin('Tag'); return 24; 
break;
case 14: return 16; 
break;
case 15: return 16; 
break;
case 16: return 16; 
break;
case 17: return 'BAD'; 
break;
}
},
rules: [/^(?:\s+)/,/^(?:<(([Tt]pl|TPL)))/,/^(?:\s+)/,/^(?:<(([Ss]cript|SCRIPT))>)/,/^(?:<\/(([Ss]cript|SCRIPT))>)/,/^(?:([a-zA-Z_][a-zA-Z0-9_-]*))/,/^(?:=)/,/^(?:"[^"]*")/,/^(?:'[^']*')/,/^(?:>)/,/^(?:.*-->)/,/^(?:<!--)/,/^(?:<\/(([Tt]pl|TPL))>)/,/^(?:<(([Uu]se|USE)))/,/^(?:(.|)+(\r*\n)*)/,/^(?:[^<]+)/,/^(?:<)/,/^(?:.)/],
conditions: {"Tag":{"rules":[0,5,6,7,8,9,17],"inclusive":true},"Tpl":{"rules":[1,11,12,13,15,16,17],"inclusive":true},"Note":{"rules":[2,10,14,16,17],"inclusive":true},"Script":{"rules":[4,15,16,17],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,17],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = IXTplParser;
exports.Parser = IXTplParser.Parser;
exports.parse = function () { return IXTplParser.parse.apply(IXTplParser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
/**
 * @param parsedData : parsing data;
 * @param transConfig : {
 *		newLine : "\n" || "\r\n"
 *		nsName : name space for gloal tpl class;
 * }
 */
function _ix_tpl__translate(parsedData, transConfig) {
	var _newline = transConfig && transConfig.newLine || "\n",
		nsName = (transConfig && transConfig.nsName || "IX.Tpl") + ".";

	var code = "", exportsCode = "", lastTag = "",
	nameSpaces = {}, lastLine = 1;

	var reg_pre = "((\\r\\n\\s*)|(\\n\\s*))";

	var EmptyLineEndReg = new RegExp(reg_pre + "$", "g");
	var EmptyLineStartReg = new RegExp("^" + reg_pre, "g");
	var EmptyLineReg = new RegExp(reg_pre, "g");

	var LineSplitReg = /(\r*\n\s*)/g;

	exportsCode = _newline;

	function _compileText(midText){
		var tArr = midText.split(LineSplitReg);
		var len = tArr.length;
		var text = "";
		for (var _i = 0; _i < len; _i++) {
			var ci = tArr[_i];
			if (!ciq)
				continue;
			var cMatch = ci.match(LineSplitReg);
			if (cMatch)
				text += ci.replace(LineSplitReg, cMatch + "'");
			else
				text += ci + (_i == len - 1 ? "" : "',");
		}
		return text;
	}
	function compileTextTag(op){
		var matchResult = null;
		var midText = op.text.replace(/'/g, "\\'");
		var prevText= "'", endText = "',";

		matchResult = midText.match(EmptyLineEndReg);
		if (matchResult) {
			endText = "'," + matchResult[0];
			midText = midText.replace(EmptyLineEndReg, "");
		}
		matchResult = midText.match(EmptyLineStartReg);
		if (matchResult) {
			prevText = matchResult[0] + "'";
			midText = midText.replace(EmptyLineStartReg, "");
		}
		matchResult = midText.match(EmptyLineReg);
		if (matchResult)
			midText = _compileText(midText);
        code += (prevText + midText + endText).replace(/'',/g, "");
	}
	//line start by 1
	//column start by 0
	function add_newline(op) {
		var totalLine = op.first_line - lastLine;
		if (totalLine >= 1) {
			for (var i = 0; i < totalLine; i++)
				code += _newline;
		}
		lastLine = op.last_line + 1;
	}
	function compleTplExport(exportValue, idValue, _prevTpls){
		var ifTopTpl = !_prevTpls || _prevTpls.length == 0;
		if (!exportValue)
			return ifTopTpl;

		var _nsValue = "t_" + idValue;
		if (!ifTopTpl) {
			var _root = "", _root_o = "t_" + _prevTpls[0];
			for (var i = 1; i<_prevTpls.length; i++)
				_root += _prevTpls[i] + ".";
			_root += idValue;
			_nsValue = "new IX.ITemplate({tpl:" + _root_o + ".getTpl('" + _root + "')})";
		}

		var _nsName = nsName + exportValue.value;
		if (nameSpaces[_nsName])
			throw "重复的命名空间：" + _nsName;
		nameSpaces[_nsName] = 1;
		exportsCode += "IX.setNS('" + _nsName + "', " + _nsValue + ");" + _newline;

		return ifTopTpl;
	}
	function compileTplTag(op, _prevTpls) {
		var idValue = op.attrs.id.value;
		var ifTopTpl = compleTplExport(op.attrs.export, idValue, _prevTpls);
		var codepair = ["", ""];

		if (!ifTopTpl) {
			codepair[0] = "'" + op.text.replace(/'/g, "\\'") + "',";
			codepair[1] = "'" + op.endText + "',";
		} else {
			lastTag = op.type;
			add_newline(op);

			_prevTpls = [];
			codepair[0] = "var t_" + idValue + " = new IX.ITemplate({tpl: [";
			codepair[1] = "'']});" + _newline;
		}
		_prevTpls.push(idValue);
		code += codepair[0];
		getCodes(op.tpls, _prevTpls);
		code += codepair[1];
		_prevTpls.pop();
	}
	function compileUseTag(op){
		var data = op.attrs.data, idValue = op.attrs.id.value;
		var tplId = null, refId = "";

		if (idValue[0] == ".") { //local template
			tplId = "t_" + idValue.substring(1);
			var idx = tplId.indexOf(".");
			if (idx > -1) {
				refId = "'" + tplId.substring(idx+1) + "'";
				tplId = tplId.substring(0, idx);
			}
		} else // use gobal template
			tplId = nsName + idValue;

		var _method = data ? ("renderData('" + refId + "', " + data.value + ")") 
				: ("getTpl(" + (refId=="''"?"":refId) + ")");
		code += tplId + "." + _method + ",";
	}
	function getCodeStr(op, _prevTpls) {
		if (!op) return;
		switch(op.type){
		case "script":
			add_newline(op);
			lastTag = "script";
			code += op.text + _newline;
			break;
		case "tpl":	compileTplTag(op, _prevTpls);break;
		case "use":	compileUseTag(op);	break;
		case "text":compileTextTag(op);	break;
		case "note":
			code += op.text.replace(/.*/g, "");
			break;
		}
	}

	function getCodes(_options, _prevTpls) {
		for (var i = 0; i<_options.length ; i++)
			getCodeStr(_options[i], _prevTpls || []);
	}

	getCodes(parsedData);
	if (lastTag == "script")
		code = code.replace(/\n$/, "");
	exportsCode = exportsCode == _newline ? "" : exportsCode;
	return "(function () {" + code + exportsCode + "})();";
}
/**
 * @param parsedData : .js.html file data
 * @param transConfig : {
 *		newLine : "\n" || "\r\n"
 *		nsName : name space for gloal tpl class;
 * }
 */
function IXTplTranslate(parsedData, transConfig) {
    try {
        return { code: _ix_tpl__translate(parsedData, transConfig) };
    } catch (ex) {
        return { error: ex };
    }
}

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.translate = IXTplTranslate;
}
var ETS_NS = "IXE.Tpl";
// ets : easy template script
window.ETS = {};
ETS.namespace = ETS_NS || "IX.Tpl";
ETS.lineDelimiter = "\n";
var etsParseErros = [];
ETS.parseErrors = etsParseErros;
var debug = "ETS_DEBUG" in window ? window.ETS_DEBUG : false;

function loadFile(_fileUrl, _successFn, _failFn) {
	var request;
	if ("XMLHttpRequest" in window) {
		request = new XMLHttpRequest();
	}
	if ("ActiveXObject" in window) {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (!request) {
		return _failFn("need AJAX");
	}
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				_successFn(request.responseText);
			} else {
				_failFn(request.status + " : " + request.statusText);
			}
		}
	};
	request.open("GET", _fileUrl, true);
	request.send("");
}

function addErrorInfo(_fileObj, _method, _ex){
	try{
		etsParseErros.push({
			method: _method,
			path: _fileObj.path,
			sourceCode: _fileObj.code,
			parseCode: _fileObj.codeStr,
			error: _ex
		});
		console.info(etsParseErros[etsParseErros.length - 1]);
		_fileObj.error = _ex.toString();
	}catch(ex){
		console.error({
			method: "addErrorInfo",
			error: ex,
			arguments: arguments
		});
	}
}
function parseFile(_fileObj) {
	try {
		if (_fileObj.fileType == "js") {
			_fileObj.codeStr = { code: _fileObj.code };
			_fileObj.parseCode = {};
			_fileObj.source_code = _fileObj.code;
		} else {
			_fileObj.parseCode = IXTplParser.parse(_fileObj.code);
			_fileObj.codeStr = IXTplTranslate(_fileObj.parseCode, {
				nsName : ETS.namespace,
				newLine: ETS.lineDelimiter 
			});
		}
	} catch (ex) {
		addErrorInfo(_fileObj, "parseFile", ex);
	}
}
function evalCode(_script, _i) {
	try {
		/*
		window.funcs = {};
		funcs[jsFilePrev + _i] = new Function("return " + _script.codeStr + ";" + "//@ sourceURL=" + _script.path);
		return funcs[jsFilePrev + _i]();
		var n = new Function("return " + _script.codeStr + ";" + "//@ sourceURL=" + _script.path);
		return n();*/
		eval(_script.codeStr + "//@ sourceURL=" + _script.path);
		/*var script= document.createElement('script');
		script.type= 'text/javascript';
		script.text = _script.codeStr + "\r\n//@ sourceURL=" + jsFilePrev + _i + ".js";
		document.body.appendChild(script);*/
	} catch (ex) {
		etsParseErros.push({
			method: "evalCode",
			path: _script.path,
			sourceCode: _script.code,
			code: _script.codeStr,
			error: ex
		});
		console.info(etsParseErros[etsParseErros.length - 1]);
	}
};

var TplFileReg = /\.js\.html?$/g;
var scriptPaths =[]; 
var loadFailFiles = [], loadedFiles, loadedSourceFiles;
var datetimetick = (new Date()).valueOf();

function _loadETScript(scriptPath){
	loadFile(scriptPath.path+"?t="+datetimetick, function (result) {
		scriptPath.code = result;
		parseFile(scriptPath);
		loadedFiles--;
		parseFiles();
	}, function (_e) {
		scriptPath.error = _e;
		loadedFiles--;
		loadFailFiles.push(scriptPath);
		parseFiles();
	});
}
function _loadETScriptSource(scriptPath){
	loadFile(scriptPath.path.replace(TplFileReg, 'js.ref.js'), function (result) {
		scriptPath.source_code = result;
		loadedSourceFiles--;
		parseFiles();
	}, function (_e) {
		scriptPath.source_error = _e;
		loadedSourceFiles--;
		loadFailFiles.push(scriptPath);
		parseFiles();
	});
}

var _debugPanel = null;
if (debug) {
	function addRule(style, selectorText, cssText, position) {
		//style标签  选择器   样式   位置 
		if (style.insertRule) { //chrome | FF |IE9+ 
			style.insertRule(selectorText + '{' + cssText + '}', position);
		} else if (style.addRule) { //IE8 IE7 IE6 
			style.addRule(selectorText, cssText, position);
		}
	}

	var tableStyles = [
		["table.etsdebug", 					"width:100%; border-collapse:collapse;table-layout:fixed;"],
		["table.etsdebug td", 				"border: 1px solid gray;"],
		["table.etsdebug td:first-child", 	"text-align:center;"],
		["table.etsdebug th", 				"border: 1px solid gray; background-color: #ccc; color:black;"],
		["table.etsdebug textarea",			"width:100%;height:100%; background-color:transparent;"],
		["table.etsdebug tr td.path",		"word-break: break-all;word-wrap: break-word;"],
		["table.etsdebug tr.error td.path", "color:red;"],
		["table.etsdebug pre", 				"width:100%;height:100%; background-color:transparent; overflow: auto;"]
	];
	
	var _style = document.createElement("style");
	_style.type = "text/css";
	document.head.appendChild(_style);
	_style = document.styleSheets[document.styleSheets.length - 1];
	var j = tableStyles.length, i = 0;
	for (; i < j; i++)
		addRule(_style, tableStyles[i][0], tableStyles[i][1], i);

	var _debugPanel = document.createElement("table");
	_debugPanel.className = 'etsdebug';
	_debugPanel.innerHTML = [
		"<colgroup>",
			"<col width='40' />",
			"<col width = '120' />",
			"<col />",
			"<col />",
			"<col />",
		"</colgroup>",
		"<thead>",
			"<tr><th colspan = 5></th><tr/>",
			"<tr><th>#</th><th>PATH</th><th>SOURCE</th><th>REF</th><th>CODE</th><tr/>",
		"</thead>",
		"<tbody></tbody>",
		"<tfoot><tr><td colspan = 5></td></tr></tfoot>"
	].join("");
	document.body.appendChild(_debugPanel);
}
function debugParseScript(ci, i, trtplcode){
	var _div = document.createElement("table");
	_div.innerHTML = [
		"<tr><td>", i+1, 
		"</td><td class='path'>", ci.path,
		"</td><td><textarea>", ci.code || ci.source_error,
		"</textarea></td><td><pre>", (ci.source_code || ci.source_error || "").replace(/</g, "&lt;"),
		"</pre></td><td><pre>", trtplcode,
		"</pre></td></tr>"].join("");

	var row = _div.rows[0];
	_debugPanel.tBodies[0].appendChild(row);

	var txt_s = row.getElementsByTagName("pre");

	var height = Math.max(txt_s[0].scrollHeight, txt_s[1].scrollHeight) + 30;
	txt_s[0].style.height = height + "px";
	txt_s[1].style.height = height + "px";

	if (txt_s[0].innerHTML != txt_s[1].innerHTML)
		row.className += "error";
}
function parseScript(ci, i){
	if (ci.load) 
		return 0;
	ci.load = true;
	
	var trtplcode  = "", hasError  = true;
	if (!ci.error) {
		if (ci.codeStr.error) {
			trtplcode = ci.codeStr.error;
			ci.codeStr = "";
			addErrorInfo(ci, "parseFiles", trtplcode);
		} else {
			hasError = false;
			ci.codeStr = ci.codeStr.code;
			trtplcode = (ci.codeStr || "").replace(/</g, "&lt;");
			evalCode(ci, i);
		}
	} else {
		trtplcode = ci.error;
		addErrorInfo(ci, "parseFiles", trtplcode);
	}
	if (debug)
		debugParseScript(ci, i, trtplcode);
	return hasError?1:0;
} 
function parseFiles() {
	if (loadedFiles != 0 || (debug && loadedSourceFiles != 0))
		return; // file not all loaded!

	var errorNum = 0, total = scriptPaths.length ;
	for (var i = 0; i < total; i++) 
		errorNum += parseScript(scriptPaths[i], i);

	if (debug) {
		var mstick = (new Date()).valueOf() - datetimetick;
		console.log("parsing tpl total use : "  + mstick + "ms");

		_debugPanel.tFoot.rows[0].cells[0].innerText = mstick;
		_debugPanel.tHead.rows[0].cells[0].innerHTML = "共" + total + "个，失败：" + errorNum + "个，耗时：" + mstick + "ms";
	}
}

var SCRIPT_TYPE = "ets" ;
function loadLinks(ci){
	 if (ci.type != SCRIPT_TYPE)
		 return;
	 var ciHref = ci.href;
	 var _file = {
			 path: ciHref,
			 code: "",
			 load: false,
			 parseCode: "",
			 error: null,
			 fileType: "js"
	 };
	 
	 if (TplFileReg.test(ciHref)) 
		 _file.fileType = "js.htm";
	 else if (! /\.js$/.test(ciHref)) 
		 return addErrorInfo(_file, "loadLinks", 
				 !ciHref ? "缺少属性“href”或href属性值为空" : "不能解析的文件，目前只支持以.js.html、.js.htm、.js为后缀的文件解析。");
	 scriptPaths.unshift(_file);
}
function loadFiles(_i) {
	var scriptPath = scriptPaths[_i];
	if (!scriptPath) 
		return;
	_loadETScript(scriptPath);

	if (debug) {
		if (scriptPath.fileType != "js") {
			_loadETScriptSource(scriptPath);
		} else {
			loadedSourceFiles--;
			parseFiles();
		}
	}
}
function onload() {
	var  scripts = document.getElementsByTagName("link");
	var i =0;
	for (i = scripts.length - 1; i >= 0; i--)
		loadLinks(scripts[i]);
	loadedFiles = scriptPaths.length;
	loadedSourceFiles = loadedFiles;
	
	for (i =0; i< scriptPaths.length; i++)
		loadFiles(i);
}

if(window.addEventListener){
	window.addEventListener("load", onload);
}else{
	window.attachEvent("onload", onload);
}
})();