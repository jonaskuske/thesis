FROM node:22.9.0-alpine3.20 AS build
WORKDIR /usr/src/app
RUN apk add bash
SHELL [ "/bin/bash", "-c" ]
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
ARG PUBLIC_ENV__APP_SHELL=${PUBLIC_ENV__APP_SHELL}
ARG PUBLIC_ENV__MODE=${PUBLIC_ENV__MODE}
ARG PUBLIC_ENV__ANIMATIONS=${PUBLIC_ENV__ANIMATIONS}
ENV PUBLIC_ENV__APP_SHELL=${PUBLIC_ENV__APP_SHELL}
ENV PUBLIC_ENV__MODE=${PUBLIC_ENV__MODE}
ENV PUBLIC_ENV__ANIMATIONS=${PUBLIC_ENV__ANIMATIONS}
RUN yarn build

FROM node:22.9.0-alpine3.20 AS runtime
WORKDIR /usr/src/app
RUN chown -R node:node .
ENV NODE_ENV=production
ENV PORT=80
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./
RUN yarn workspaces focus --production && yarn cache clean --mirror && chown -R node:node .yarn
COPY --chown=node:node ./server ./server
COPY --chown=node:node ./utils ./utils
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
EXPOSE 80
HEALTHCHECK --retries=2 --timeout=7s CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1
USER node
CMD [ "yarn", "server:prod" ]
