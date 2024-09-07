FROM node:20.9.0
WORKDIR /usr/src/app

COPY . .

ENV PORT=8080
EXPOSE 8080

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
