FROM node:22.9.0-alpine3.20 AS build
WORKDIR /usr/src/app
RUN apk add bash
SHELL [ "/bin/bash", "-c" ]
COPY /.yarn/releases ../.yarn/releases
COPY presentation/package.json presentation/yarn.lock presentation/.yarnrc.yml ./
RUN yarn install --immutable
COPY presentation .
COPY public ../public
RUN yarn build --base /slides/

FROM nginx:1.25.4-alpine3.18
WORKDIR /usr/share/nginx/html
COPY public index.html ./
COPY ["./doc/Stream Stitching and the App Shell Model.pdf", "./"]
COPY --from=build /usr/src/app/dist ./slides
