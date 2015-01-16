%lex

PTPL ([Tt]'pl'|'TPL')
PSCRIPT ([Ss]'cript'|'SCRIPT')
PNAME [a-zA-Z_][a-zA-Z0-9_-]*
PUSE ([Uu]'se'|'USE')
PNOTE (!--)

%s Tag Tpl Note Script
%%

<INITIAL,Tag>\s+              /* skip whitespace */

<INITIAL,Tpl>'<'{PTPL}        %{ this.begin('Tpl'); this.begin('Tag'); return 'TPL'; %}
<INITIAL,Note>\s+              /* skip whitespace */
<INITIAL>'<'{PSCRIPT}'>'      %{ this.begin('Script'); return 'SCRIPT'; %}

<Script>'</'{PSCRIPT}'>'      %{ this.popState(); return 'ESCRIPT'; %}

<Tag>{PNAME}                  %{ return 'NAME'; %}
<Tag>'='                      %{ return '='; %}
<Tag>'"'[^"]*'"'              %{ return 'STR'; %}
<Tag>"'"[^']*"'"              %{ return 'STR'; %}
<Tag>'>'                      %{ this.popState(); return '>'; %}

<Note>.*'-->'                 %{ this.popState(); return '-->'; %}

<Tpl>'<!--'                   %{ this.begin('Note'); return 'NOTE'; %}
<Tpl>'</'{PTPL}'>'            %{ this.popState(); return 'ETPL'; %}
<Tpl>'<'{PUSE}                %{ this.begin('Tag'); return 'USE'; %}

<Note>(.|)+(\r*\n)*           %{ return 'TEXT'; %}
<Script,Tpl>[^<]+             %{ return 'TEXT'; %}
<Script,Tpl,Note>'<'          %{ return 'TEXT'; %}

.                             %{ return 'BAD'; %}

/lex

%start p

%%

p: |				
   stmts			{ return $1;}
   ;

stmts: stmt			{ $$ = [$1]; }
     | stmts stmt		{ $$ = $1; $$.push($2); }
     ;

stmt: tpl_stmt
    | script_stmt
    ;

tpl_stmt: TPL attrs '>' tpl_elements ETPL { $$ = {type:"tpl"}; $$.text= $1;$$.endText= $5; for(var p in $2) if(p!="export") $$.text += " " + $2[p].text; $$.text+=">"; $$.attrs = $2; $$.tpls = $4; $$.first_line = @1.first_line; $$.first_column = @1.first_column; $$.last_line = @5.last_line; $$.last_column = @5.last_column;}
        ;

script_stmt: SCRIPT texts ESCRIPT { $$ = $2; $$["type"] = "script"; $$.first_line = @1.first_line; $$.first_column = @1.first_column; $$.last_line = @3.last_line; $$.last_column = @3.last_column; }
           ;

texts: TEXT         { $$={}; $$.text=$1; }
     | texts TEXT   { $$=$1; $1.text=$1.text+$2; }
	 ;

attrs: attr		{ $$ = $1; }
     | attrs attr	{ $$ = $1; for(var p in $2) $$[p] = $2[p]; }
     ;

attr: NAME '=' STR	{ $$ = {}; $$[($1+"").toLowerCase()] = {text: $1+'='+$3, value: !$3?"":$3[0]=="'"||$3[0]=="\""?$3.substr(1,$3.length-2):$3}; }
    ;

tpl_elements: tpl_element		{ $$ = [$1]; }
            | tpl_elements tpl_element	{ $$ = $1; var last=$$[$$.length-1]; if(last!=null && last.type=="text" && $2.type=="text" && !last.text.match(/((\n\s*)|(\r\n\s*))$/) &&  !$2.text.match(/^((\n\s*)|(\r\n\s*))/)) $$[$$.length-1].text+=$2.text; else $$.push($2); }
            ;

tpl_element: TEXT	{ $$ = {type:"text"}; $$.text = $1; }
           | note_stmt { $$ = $1; }
           | tpl_stmt	{ $$ = $1; }
           | use_stmt	{ $$ = $1; }
           ;

use_stmt: USE attrs '>' { $$ = {type: 'use'}; $$.attrs = $2;  }
        ;
note_stmt: NOTE texts '-->' {  $$ = $2; $$["type"] = "note"; }
        ;
