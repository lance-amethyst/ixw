#!/usr/sh

cd www
npm install > /dev/null
grunt preless
grunt deployToServer
cd ../server
echo "==================================================================="
echo "if you need to create default database, please uncomment next line!"
# mysql -uroot --password=root < service/db/db.sql
echo "==================================================================="
mkdir files upload_files views
npm install > /dev/null