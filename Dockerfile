# Stage 1
FROM node:alpine as build-step
RUN apk update && apk add --no-cache make git

# a) create app directory
RUN mkdir -p /app
RUN chmod -R 777 /app
WORKDIR /app

# b) Create app/nginx directory and copy default.conf to it
WORKDIR /app/nginx
COPY nginx/conf.d/default.conf /app/nginx/

# c) Install app dependencies
COPY package.json package-lock.json /app/
RUN cd /app && npm set progress=false && npm install

# d) Copy project files into the docker image and build your app
COPY .  /app
RUN cd /app && npm run build:ssr

RUN ls -li


# Stage 2
FROM nginx:alpine

# a) Remove default nginx code
RUN rm -rf /usr/share/nginx/html/*

# b) From 'build-step' copy your site to default nginx public folder
COPY --from=build-step /app/dist/CanaWebNG /usr/share/nginx/html

# c) copy your own default nginx configuration to the conf folder
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
