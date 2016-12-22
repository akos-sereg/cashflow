#!/bin/bash

mysql_host=127.0.0.1
mysql_user=root
mysql_dbname=cashflow
sqlite3_dbname=database.sqlite3

# dump the mysql database to a txt file
mysqldump --skip-create-options --compatible=ansi --skip-extended-insert --compact --single-transaction -h$mysql_host -u$mysql_user -p $mysql_dbname  > /tmp/localdb.txt

# remove lines mentioning "PRIMARY KEY" or "KEY"
cat /tmp/localdb.txt | grep -v "PRIMARY KEY" | grep -v KEY > /tmp/localdb.txt.1

# mysqldump leaves trailing commas before closing parentheses  
perl -0pe 's/,\n\)/\)/g' /tmp/localdb.txt.1 > /tmp/localdb.txt.2

# change all \' to ''
sed -e 's/\\'\''/'\'''\''/g' /tmp/localdb.txt.2 > /tmp/localdb.txt.3

if [ -e $sqlite3_dbname ]; then
    mv $sqlite3_dbname $sqlite3_dbname.bak
fi
sqlite3 $sqlite3_dbname < /tmp/localdb.txt.3