#!/bin/sh

mkdir ../src/lib
mkdir ../src/bootstrap
cp ../lib/ix/ixutils.js ../src/lib/ixutils.js

cp -r ../lib/bootstrap3.2.0/dist/fonts ../src/bootstrap/
cp -r ../lib/bootstrap3.2.0/less ../src/bootstrap/

cp ../lib/bootstrap3.2.0/dist/js/bootstrap.js ../src/lib/bootstrap.js
cp ../lib/jquery2.1.1/jquery-2.1.1.js ../src/lib/jquery.js
cp less/less-1.7.5.min.js ../src/lib/less.min.js

cd tpl
node deploy --NS=IXE.Tpl -f ../../src/lib/ets.js 1>/dev/null

echo "Deployed ixutils/jquery/bootstrap/less/tpl to libs"