# production environment
# FROM nginx:stable-alpine
# FROM node:14
FROM nguyenvietquoc2569/node-beta-tools:latest
WORKDIR /usr/src/app
EXPOSE 3000

COPY dist/apps/social-tools /usr/src/app
COPY package.json ./
RUN yarn install
# new
CMD [ "yarn", "start-beta-prod" ]
