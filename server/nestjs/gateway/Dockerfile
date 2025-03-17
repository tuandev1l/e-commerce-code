#FROM node:20 AS build
#
#COPY package*.json ./
#
#RUN npm install --omit-dev --force
#
#COPY . .
#
#RUN npm run build
#
## Start the server using the production build
#CMD [ "node", "dist/main.js" ]
#

FROM node:20

COPY dist ./dist
COPY node_modules ./node_modules

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
