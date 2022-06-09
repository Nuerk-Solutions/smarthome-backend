FROM node:16 as build

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build

FROM node:16
WORKDIR /app
COPY package.json .
COPY logbookbackend-firebase-adminsdk-*.json .
COPY .env.development .
RUN yarn install --production
COPY --from=build /app/dist ./dist
CMD yarn run start:prod