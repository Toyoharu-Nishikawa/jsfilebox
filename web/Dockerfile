FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
COPY nginx/conf.d /etc/nginx/conf.d
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY public /usr/share/nginx/html
