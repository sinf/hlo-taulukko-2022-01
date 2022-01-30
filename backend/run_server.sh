#!/bin/bash
cd /app
if [ -z $PORT ]; then
	PORT=80;
fi
export ASPNETCORE_URLS="http://0.0.0.0:$PORT"
export DATABASE="/app/personnel.db"
dotnet backend.dll

