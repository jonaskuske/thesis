FROM node:22.9.0-alpine3.20 AS build
WORKDIR /usr/src/app
RUN apk add bash
SHELL [ "/bin/bash", "-c" ]
COPY presentation/package.json presentation/yarn.lock presentation/.yarnrc.yml ./
RUN --mount=src=../.yarn/releases,dst=../.yarn/releases yarn install --immutable
COPY presentation .
RUN --mount=src=../.yarn/releases,dst=../.yarn/releases --mount=src=public,dst=../public yarn build --base /slides/

FROM nginx:1.25.4-alpine3.18
COPY public /usr/share/nginx/html/public
COPY version-selector.html /usr/share/nginx/html/index.html
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/slides
