#!/bin/sh
set -x -e
source ./heroku-apps.cfg
cd hlo-taulukko-app
app2=$heroku_backend_app
app=$heroku_frontend_app
heroku container:push --arg REACT_APP_BACKEND_URL="https://$app2.herokuapp.com"  -a $app web
heroku container:release -a $app web
