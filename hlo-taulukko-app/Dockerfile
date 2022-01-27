FROM node:14 AS build-env
WORKDIR /app
COPY .npmrc /app/
COPY package.json /app/
RUN npm install --no-audit --prefer-offline

COPY tsconfig.json .
COPY public ./public
COPY src ./src
RUN find /app

ARG REACT_APP_BACKEND_URL
RUN npm run build

FROM nginx
COPY --from=build-env /app/build /app/www
COPY --from=build-env /app/package-lock.json /app/
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./start_nginx.sh /app/

EXPOSE 80

RUN find /app
RUN cat /etc/nginx/nginx.conf

ARG REACT_APP_BACKEND_URL
RUN echo $REACT_APP_BACKEND_URL

ENTRYPOINT ["/app/start_nginx.sh"]

