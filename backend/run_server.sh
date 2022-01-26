#!/bin/bash
cd /app
if [ -z $PORT ]; then
	PORT=80;
fi
ASPNETCORE_URLS="http://0.0.0.0:$PORT" dotnet backend.dll

