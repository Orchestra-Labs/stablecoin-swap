FROM node:22-alpine
WORKDIR /usr/src/app

COPY . .

ENV PORT=4173
ENV VITE_APP_URL=https://orchestralabs.org/
ENV VITE_WALLETCONNECT_PROJECT_ID=70ba37949838afd24f17421f5b6bcfd0
EXPOSE 4173

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]