# Stage 1
FROM node as build-step
RUN mkdir -p /app
RUN chmod -R 777 /app

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app
RUN npm run build --prod --optimization=false
RUN ls -li

# Stage 2
FROM nginx:stable-alpine
COPY --from=build-step /app/dist/CanaWebNG /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
