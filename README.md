<div align=center>
<h1 align=center>Thesis</h1>

<p align=center>⚡ Comparing hybrid applications powered by Service Workers to MPAs and SPAs</p>

<p align=center><img width=600 src=https://user-images.githubusercontent.com/30421456/191315428-b6c14329-9528-47c8-a3d4-26e8c468e39d.png></p>
</div>

<br>
<br>

---

## Published versions:

#### Multi-Page Application (MPA) — [https://thesis-mpa.joku.co](https://thesis-mpa.joku.co)

A "classic" website, pages are fully server-rendered. After clicking a link, the browser performs a full navigation, loading a new document in a fresh context. Interactions are handled through `<form>` navigations.

<!--

#### Hydrated MPA — [https://thesis-mpa.joku.co](https://thesis-mpa.joku.co)

Fully server-rendered, clicking a link performs a full navigation. Instead of using `<form>`, pages are made interactive through client-side JavaScript in a process called "hydration" and operations happen through async `fetch` requests.

-->

#### MPA with stream-stitched App Shell — [https://thesis-mpa-shell.joku.co](https://thesis-mpa-shell.joku.co)

Fully server-rendered upon first visit. After the page is loaded, an HTML Shell consisting of the `<head>` portion and common `<body>` elements is added to the browser cache. After clicking a link, the browser performs a full navigation, but now a Service Worker immediately sends the cached App Shell in a Response Stream. It simultaneously requests just the `<body>` portion of the loaded page from the server and "stitches" the response into the Response Stream, after the Shell.

#### Single-Page Application (SPA) — [https://thesis-spa.joku.co](https://thesis-spa.joku.co)

No matter which page is requested, the server always responds with the same plain HTML document that contains no content. Once loaded, client-side JavaScript will populate the document with content and handle all subsequent navigations and interactions.

#### SPA with App Shell — [https://thesis-spa-shell.joku.co](https://thesis-spa-shell.joku.co)

Like a regular Single-Page Application, but required assets and the plain HTML document are served from the local cache once the Service Worker is installed. [^1]

#### SPA with Server-Side Rendering (SSR) — [https://thesis-isomorphic.joku.co](https://thesis-isomorphic.joku.co)

Upon first visit the server responds with the fully-rendered HTML document for the requested page. Once loaded in the browser, client-side JavaScript will take over in a process called hydration and handle all subsequent navigations and interactions.

#### SPA with SSR and stream-stitched App Shell — [https://thesis-isomorphic-shell.joku.co](https://thesis-isomorphic-shell.joku.co)

Initial load works the same way as the _MPA with stream-stitched App Shell_ variant: the server only responds with the HTML partial that contains the content, which is combined with the cached App Shell by the Service Worker. After load, JavaScript hydrates the page and handles all further navigations and interactions.

## Current results

> 🗓️ last updated 12/10/22

#### Lighthouse: MPA vs. MPA with Stream Stitching

<div align=center>
<p align="center">
<img width="400px" src="https://user-images.githubusercontent.com/30421456/195812208-fe905493-5b09-45f3-a275-6e8a4947a914.png">
<img width="400px" src="https://user-images.githubusercontent.com/30421456/195812231-7406442a-9d12-413f-ba66-7cdc2f2543b3.png">
</p>
</div>

In the early prototype consisting of just two simple pages, performance is stellar for both versions. Still, utilizing a Service Worker with stream stitching reduces both First and Largest Contentful Paint by up to 1s. However, the implementation complexity for the architecture with Stream Stitching is already a lot higher than for the one without it, with many edge cases to handle. Whether the complexity peaks at some point or keeps increasing as the app grows is a crucial aspect of the architecture comparison.

Another interesting observation is that stream stitching caused a higher Total Blocking Time. It's still low in this test, but looking at other test runs under different conditions, it seems to increase with network delays and server response times, while it doesn't for the plain MPA. This requires further investigation.

[^1]: Stream Stitching is used to insert the initial JSON data for client-side rendering into the HTML document, but this is merely an implementation detail caused by architectural constraints specific to this codebase: App Shell architecture for SPAs can be implemented without Stream Stitching. The data for initial rendering can be fetched via Ajax, as is already the case for navigations happening after the initial load. This makes modifications to the cached HTML document and thus Stream Stitching unnecessary.
