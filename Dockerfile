FROM node:18.16.0
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
COPY .npmrc ./
RUN npm i
ENV NODE_OPTIONS='--max-http-header-size=30000'
COPY . .

ARG ENVIRONMENT_ARG

RUN npm run build:$ENVIRONMENT_ARG

EXPOSE 3000
CMD ["npm", "run", "start"]