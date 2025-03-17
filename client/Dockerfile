# Base image
FROM node:20 AS build

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

FROM nginx:stable-alpine3.20-perl

# Expose the port that the Nginx server will listen on
EXPOSE 80

# Copy the built artifacts from the build stage to the Nginx HTML directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# COPY --from=build /usr/src/app/dist /usr/src/app/dist
# COPY nginx.conf /etc/nginx/conf.d/default.conf
