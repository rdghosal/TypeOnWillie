FROM mcr.microsoft.com/mssql/server:2019-CU8-ubuntu-16.04 AS test-db
EXPOSE 1433
USER root
ARG SA_PASSWORD
ARG DBNAME
ARG DB_USER
ENV SA_PASSWORD=${SA_PASSWORD}
ENV DBNAME=${DBNAME}
ENV DB_USER=${DB_USER}
WORKDIR /var/opt/mssql/data/
WORKDIR /var/opt/mssql/data/backup
WORKDIR /
COPY type_on_willie.bak .
COPY entrypoint.sh .
RUN ["/bin/bash", "./entrypoint.sh"]
