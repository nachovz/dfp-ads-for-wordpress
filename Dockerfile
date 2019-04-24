FROM gitpod/workspace-full

USER root

RUN apt-get update && apt-get -y install apache2 mysql-server

RUN echo "include /workspace/lamp-example/apache/apache.conf" > /etc/apache2/apache2.conf
RUN echo ". /workspace/lamp-example/apache/envvars" > /etc/apache2/envvars

RUN echo "!include /workspace/lamp-example/mysql/mysql.cnf" > /etc/mysql/my.cnf

RUN mkdir /var/run/mysqld
RUN chown gitpod:gitpod /var/run/apache2 /var/lock/apache2 /var/run/mysqld

RUN addgroup gitpod www-data