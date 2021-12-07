# Stage 1
FROM node:latest as build-step

RUN mkdir -p /app
RUN chmod -R 777 /app
WORKDIR /app

COPY . /app
RUN npm install
RUN npm run build --prod --optimization=false --baseHref=/ui/

RUN ls -li

# Stage 2
FROM nginx:latest
COPY --from=build-step /app/dist/CanaWebNG /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/conf.d/default.conf
