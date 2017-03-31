FROM php:5.6-alpine
MAINTAINER FAN ZHISHEN <thedarkprincedc@yahoo.com>
COPY app /var/www/html
EXPOSE 80/tcp

CMD php -S 0.0.0.0:80 -t /var/www/html
