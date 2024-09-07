FROM node:20.11.0-alpine AS build
WORKDIR /usr/src/app
RUN apk add bash
SHELL [ "/bin/bash", "-c" ]
COPY ./.yarn ./.yarn
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

FROM node:20.11.0-alpine AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=80
COPY .yarn/patches .yarn/patches
COPY .yarn/releases .yarn/releases
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn workspaces focus --production
COPY ./server ./server
COPY ./utils ./utils
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 80
HEALTHCHECK --retries=2 --timeout=7s CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1
RUN chown -R node:node .
USER node
CMD [ "yarn", "server:prod" ]
