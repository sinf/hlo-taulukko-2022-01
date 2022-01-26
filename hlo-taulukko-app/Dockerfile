FROM node:alpine AS build-env
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx
COPY --from=build-env /app/build /app/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx"]

