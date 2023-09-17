FROM node:20 as build

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build

FROM node:20
WORKDIR /app
COPY package.json .
COPY logbookbackend-firebase-adminsdk-*.json .
COPY .env.development .
RUN yarn install --production
COPY --from=build /app/dist ./dist
CMD yarn run start:prod

# Deploy commands
# gcloud auth login
# docker tag app eu.gcr.io/logbookbackend/app
# docker push eu.gcr.io/logbookbackend/app
# See https://www.youtube.com/watch?v=ZmfDlUAokYc