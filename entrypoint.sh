echo "Executing backup of ${DBNAME}."
/opt/mssql/bin/sqlservr --accept-eula > /sqlservr.out & tail -f /sqlservr.out | grep -qe "Serv.*start" && sleep 5 \
	&& /opt/mssql-tools/bin/sqlcmd -S localhost -U $DB_USER -P $SA_PASSWORD -Q "RESTORE DATABASE ${DBNAME} FROM DISK = N'/${DBNAME}.bak' WITH REPLACE, MOVE '${DBNAME}' TO '/var/opt/mssql/data/${DBNAME}.mdf', MOVE '${DBNAME}_log' TO '/var/opt/mssql/data/${DBNAME}.ldf'" \
	&& pkill sqlservr
echo "Backup complete."
