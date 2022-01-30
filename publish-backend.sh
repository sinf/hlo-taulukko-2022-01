#!/bin/sh
set -x -e
source ./heroku-apps.cfg
cd backend
app=$heroku_backend_app
heroku container:push -a $app web
heroku container:release -a $app web
