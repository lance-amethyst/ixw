@IF EXIST "%~dp0\node_modules\grunt-cli\bin\grunt" (
  node  "%~dp0\node_modules\grunt-cli\bin\grunt" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "d:nodeJS\node_global\node_modules\grunt-cli\bin\grunt" %*
)