#!/bin/bash
cd /app
if [ -z $PORT ]; then
	PORT=80;
fi
ASPNETCORE_ENVIRONMENT="http://0.0.0.0:$PORT" dotnet backend.dll

