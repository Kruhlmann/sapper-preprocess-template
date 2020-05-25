FROM node:14-alpine

WORKDIR /usr/app
COPY yarn.lock .
RUN yarn install --quiet
COPY . .
RUN yarn run build
EXPOSE 3000
ENTRYPOINT ["node", "__sapper__/build"]
