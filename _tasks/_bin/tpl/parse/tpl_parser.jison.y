%lex

PTPL ([Tt]'pl'|'TPL')
PSCRIPT ([Ss]'cript'|'SCRIPT')
PNAME [a-zA-Z_][a-zA-Z0-9_-]*
PUSE ([Uu]'se'|'USE')

%s Tag Tpl Script
%%

<INITIAL,Tag>\s+              /* skip whitespace */

<INITIAL,Tpl>'<'{PTPL}        %{ this.begin('Tpl'); this.begin('Tag'); console.log("token:["+yytext+"]"); return 'TPL'; %}
<INITIAL>'<'{PSCRIPT}'>'      %{ this.begin('Script'); console.log("token:["+yytext+"]"); return 'SCRIPT'; %}

<Script>'</'{PSCRIPT}'>'      %{ this.popState(); console.log("token:["+yytext+"]"); return 'ESCRIPT'; %}

<Tag>{PNAME}                  %{ console.log("token:["+yytext+"]"); return 'NAME'; %}
<Tag>'='                      %{ console.log("token:["+yytext+"]"); return '='; %}
<Tag>'"'[^"]*'"'              %{ console.log("token:["+yytext+"]"); return 'STR'; %}
<Tag>"'"[^']*"'"              %{ console.log("token:["+yytext+"]"); return 'STR'; %}
<Tag>'>'                      %{ this.popState(); console.log("token:["+yytext+"]"); return '>'; %}

<Tpl>'</'{PTPL}'>'            %{ this.popState(); console.log("token:["+yytext+"]"); return 'ETPL'; %}
<Tpl>'<'{PUSE}                %{ this.begin('Tag'); console.log("token:["+yytext+"]"); return 'USE'; %}

<Script,Tpl>[^<]+             %{ console.log("token:["+yytext+"]"); return 'TEXT'; %}
<Script,Tpl>'<'               %{ console.log("token:["+yytext+"]"); return 'TEXT'; %}

.                             %{ console.log("token:["+yytext+"]"); return 'BAD'; %}

/lex

%start p

%%

p: |
     stmts
   ;

stmts: stmt
     | stmts stmt
     ;

stmt: tpl_stmt
    | script_stmt
    ;

tpl_stmt: TPL attrs '>' tpl_elements ETPL { console.log("tpl_stmt" + @1.first_line + "." + @1.first_column + "->" + @1.last_line + "." + @1.last_column); }
        ;

script_stmt: SCRIPT texts ESCRIPT { console.log("script_stmt texts={"+$2.text+"}"); }
           ;

texts: TEXT         { $$={}; $$.text=$1; }
     | texts TEXT   { $$=$1; $1.text=$1.text+$2; }
	 ;

attrs: attr
     | attrs attr
     ;

attr: NAME '=' STR { console.log("attr"); }
    ;

tpl_elements: tpl_element
            | tpl_elements tpl_element
            ;

tpl_element: TEXT        { console.log("TEXT[", $1, "]"); }
           | tpl_stmt
		   | use_stmt
           ;

use_stmt: USE attrs '>' { console.log("use_stmt"); }
        ;
