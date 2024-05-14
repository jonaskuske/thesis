<div align=center>
<h1 align=center>Stream Stitching and the App Shell Model</h1>

<p align=center>⚡ Accelerating Multi-Page App Rendering Through Service Workers</p>

<p align=center><img width=600 src=https://user-images.githubusercontent.com/30421456/191315428-b6c14329-9528-47c8-a3d4-26e8c468e39d.png></p>
</div>

<br>
<br>

## Usage

#### Installation

This project requires Node.js version 20 or higher. Once Node is installed, make sure to run `corepack enable` at least once to enable built-in support for package managers like yarn or pnpm.

`yarn install` - Install dependencies

#### Development

You can start a development server with features like hot module reload. The application variant to start is [configurable through environment variables](#configuration-through-environment-variables).

`yarn dev` - Starts development server on port [`:3000`](http://localhost:3000)

#### Production

To deploy the application, you first need to compile it with the build command. Then, you can start the server in production mode. The application variant to build and serve is [configurable through environment variables](#configuration-through-environment-variables).

`yarn build` - Build for production

`yarn server:prod` - Serve built application in production mode on port [`:3000`](http://localhost:3000)

## Configuration through environment variables

The variant to start/build can be configured through two environment variables:

**`PUBLIC_ENV__APP_SHELL`**: `true | false`

**`PUBLIC_ENV__MODE`**: `MPA | SPA | ISOMORPHIC`

The variables can be prefixed to a command:

```bash
PUBLIC_ENV__MODE=MPA PUBLIC_ENV__APP_SHELL=true yarn dev
```

or with PowerShell:

```powershell
$env:PUBLIC_ENV__MODE="MPA"; $env:PUBLIC_ENV__APP_SHELL="true"; yarn dev
```

## Deployed variants

#### Version selector — [thesis.joku.co](https://thesis.joku.co)

Overview and interactive selection of the deployed versions listed below.

#### Multi-Page Application — [thesis-mpa.joku.co](https://thesis-mpa.joku.co)

A "classic" website, pages are fully server-rendered. After clicking a link, the browser performs a full navigation, loading a new document in a fresh context. Interactions are handled through `<form>` navigations.

#### Multi-Page Application with Stream-Stitched App Shell — [thesis-mpa-shell.joku.co](https://thesis-mpa-shell.joku.co)

Fully server-rendered upon first visit. After the page is loaded, an HTML Shell consisting of the `<head>` portion and common `<body>` elements is added to the browser cache. After clicking a link, the browser performs a full navigation, but now a Service Worker immediately sends the cached App Shell in a Response Stream. It simultaneously requests just the `<body>` portion of the loaded page from the server and "stitches" the response into the Response Stream, after the Shell.

#### Single-Page Application (SPA) — [thesis-spa.joku.co](https://thesis-spa.joku.co)

No matter which page is requested, the server always responds with the same plain HTML document that contains no content. Once loaded, client-side JavaScript will populate the document with content and handle all subsequent navigations and interactions.

#### Single-Page Application with App Shell — [thesis-spa-shell.joku.co](https://thesis-spa-shell.joku.co)

Like a regular Single-Page Application, but required assets and the plain HTML document are served from the local cache once the Service Worker is installed. [^1]

#### Isomorphic Application — [thesis-isomorphic.joku.co](https://thesis-isomorphic.joku.co)

Upon first visit the server responds with the fully-rendered HTML document for the requested page. Once loaded in the browser, client-side JavaScript will take over in a process called hydration and handle all subsequent navigations and interactions.

#### Isomorphic Application with Stream-Stitched App Shell — [thesis-isomorphic-shell.joku.co](https://thesis-isomorphic-shell.joku.co)

Initial load works the same way as the _MPA with stream-stitched App Shell_ variant: the server only responds with the HTML partial that contains the content, which is combined with the cached App Shell by the Service Worker. After load, JavaScript hydrates the page and handles all further navigations and interactions.

[^1]: Stream Stitching is used for the SPA, too, but this is merely an implementation detail caused by architectural constraints specific to this codebase: App Shell architecture for SPAs can be implemented without Stream Stitching.

<br>
<br>
<br>

---

<br>

Jonas Kuske, 2024
