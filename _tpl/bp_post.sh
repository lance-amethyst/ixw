#!/usr/sh

cd www
npm install
grunt preless
grunt deployToServer
cd ../server
# mysql -uroot --password=root < service/db/db.sql
mkdir files upload_files views
npm install