FROM node:20.11.0-alpine as build
WORKDIR /usr/src/app
RUN apk add bash
SHELL [ "/bin/bash", "-c" ]
COPY ./.yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
ARG PUBLIC_ENV__APP_SHELL=${PUBLIC_ENV__APP_SHELL}
ARG PUBLIC_ENV__MODE=${PUBLIC_ENV__MODE}
ENV PUBLIC_ENV__APP_SHELL=${PUBLIC_ENV__APP_SHELL}
ENV PUBLIC_ENV__MODE=${PUBLIC_ENV__MODE}
RUN yarn build

FROM node:20.11.0-alpine
WORKDIR /usr/src/app
ENV NODE_ENV production
ENV PORT 80
COPY .yarn/patches .yarn/patches
COPY .yarn/releases .yarn/releases
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn workspaces focus --production
COPY ./server ./server
COPY ./utils ./utils
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 80
RUN chown -R node:node ${HOME}/.yarn/berry
RUN chown -R node:node .
USER node
CMD [ "yarn", "server:prod" ]
