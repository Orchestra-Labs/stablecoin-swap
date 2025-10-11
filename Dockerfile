FROM node:20.20.0

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare yarn@4.5.3 --activate

WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

COPY . .

ENV PORT=4173
ENV NODE_ENV=production
EXPOSE 4173

RUN yarn build

CMD ["yarn", "start"]