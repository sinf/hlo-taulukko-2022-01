#!/bin/bash

c=/etc/nginx/conf.d/default.conf

if [ -z $PORT ]; then
	PORT=80;
fi

sed -i "s/\(listen\) [0-9]\+/\1 $PORT/" "$c"
sed -i "s/\(listen ....\):[0-9]\+/\1:$PORT/" "$c"

/usr/sbin/nginx

