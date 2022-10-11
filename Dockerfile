FROM node:16.17.1-alpine as build
WORKDIR /usr/src/app
COPY ./.yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml .pnp.cjs .pnp.loader.mjs ./
RUN yarn install --immutable --immutable-cache
COPY . .
RUN yarn build

FROM node:16.17.1-alpine
WORKDIR /usr/src/app
ENV NODE_ENV production
ENV PORT 80
COPY .yarn/releases .yarn/releases
COPY package.json yarn.lock .yarnrc.yml .pnp.cjs .pnp.loader.mjs ./
RUN yarn workspaces focus --production
COPY ./server ./server
COPY ./utils ./utils
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 80
RUN chown -R node:node .
USER node
CMD [ "yarn", "server:prod" ]