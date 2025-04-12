<br><br>

<h1 class="nocount">Stream Stitching and the App Shell Model:</h1>
<h2 class="nocount">Accelerating Multi-Page App Rendering Through Service Workers</h2>

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

Exposé

<br>

Jonas Kuske  
Student no. 34728  
mail@jonaskuske.com

<br>

Digitale Medienproduktion (DMP)  
University of Applied Sciences Bremerhaven
+++

<h2 class=nocount>Abstract</h2>

Since 2016, popular web browsers such as Chrome, Edge and Safari have supported JavaScript interfaces for working with streams. There are different areas of application for these. One of them was described in 2018 by Jeff Posnick, a developer from the Chrome team: According to Posnick, the combination of streams, service workers and partial HTML templates should enable a fast, app-like user experience even for pages that are built as multi-page applications (MPAs), where navigations and interactions are handled by a full page reload, versus single-page and isomorphic applications (SPAs), which use large amounts of JavaScript code to avoid page reloads and handle all navigations and interactions directly on the client. To achieve this, a service worker caches the HTML fragments that form the application shell and then uses stream stitching to merge the cached fragments with HTML requested from the server. The resulting response stream is available immediately after a request: the fragments from the server arrive while the application shell is already streamed to the page. This paper is intended to examine the advantages and disadvantages of the web app architecture described by Posnick in comparison to already established architectures such as SPAs and classic MPAs. It should determine whether the streamed app shell makes navigations within an app fast enough to make this architecture a viable alternative to routing and rendering on the client for apps aiming for a responsive, app-like user experience.

For this purpose, an example app will be developed in different variants. For each architecture to be compared, a variant of the app is to be created, whereby the variants are to match as far as possible in order to ensure comparability. The variants will be derived from a single codebase, only the logic concerned with rendering, routing and caching will differ between the variants. Key figures, such as file sizes and performance metrics like First Contentful Paint or Time To Interactive, can then be collected. Performance should not only be considered under ideal conditions. The impact of external factors such as hardware performance of the end device or network stability will be examined using established web performance testing tools. The data obtained in this way can then be analyzed in order to draw conclusions about the advantages and disadvantages of the various web app architecture paradigms. It will be used to determine whether the different architectures manage to meet performance targets set by UX research. In addition to the experiment carried out, a literature analysis is part of the work in order to shed light on the background of the technologies used.

+++

<h2 class=nocount>Preliminary Outline</h2>

{{TOC}}

 # Introduction
 ## Background
 ## Document Structure
 # Fundamentals
 ## Multi-Page Applications
 ## Single-Page Applications
 ## Isomorphic Applications
  ## App Shell Architecture
 ### Technical Foundations
 ### Functional Principle
 ### Advantages and Disadvantages
 # Methods
 ## Concept & Development
 ### Example Application
 ### Software Stack
 ### Implementation
 ## Data Collection
 ## Data Analysis
 # Results
 ## Developed Application
 ## Testing Results
 # Discussion
 # Conclusion and Outlook
 
 +++
 
 <h2 class=nocount id=preliminary-bibliography>Preliminary Bibliography</h2>

- "How to make MPAs that are as fast as SPAs." Accessed: Jan. 15, 2024. [Online]. Available: https://gomakethings.com/how-to-make-mpas-that-are-as-fast-as-spas/
- A List Apart. "Now THAT’S What I Call Service Worker!" Accessed: Jan. 15, 2024. [Online]. Available: https://alistapart.com/article/now-thats-what-i-call-service-worker/  
- Addy Osmani and Jason Miller. "Rendering on the Web." Accessed: Jan. 15, 2024. [Online]. Available: https://web.dev/articles/rendering-on-the-web#streaming_server-side_rendering_and_progressive_rehydration
- Addy Osmani and Matt Gaunt. "Instant Loading Web Apps with an Application Shell Architecture." Accessed: Jan. 15, 2024. [Online]. Available: https://developer.chrome.com/blog/app-shell
- Aleksi Huotala, "Benefits and Challenges of Isomorphism in Single-Page Applications: A Case Study and Review of Gray Literature," Master Thesis, University of Helsinki, Helsinki, 2021. [Online]. Available: https://helda.helsinki.fi/server/api/core/bitstreams/d5b170ee-076f-4a79-8173-86b35c4774df/content
- Alex Russell. "Making a concurrent request for navigations." Accessed: Jan. 15, 2024. [Online]. Available: https://github.com/w3c/ServiceWorker/issues/920
- J. Archibald. "2016 - the year of web streams." Accessed: Jun. 16, 2022. [Online]. Available: https://jakearchibald.com/2016/streams-ftw/
- J. Archibald. "Streaming requests with the fetch API." Accessed: Jun. 16, 2022. [Online]. Available: https://web.dev/fetch-upload-streaming/
- Chris Coyier. "The Great Divide." Accessed: Jan. 15, 2024. [Online]. Available: https://css-tricks.com/the-great-divide/
- Chris Haynes. "Streaming HTML out of order without JavaScript." Accessed: Jan. 16, 2024. [Online]. Available: https://lamplightdev.com/blog/2024/01/10/streaming-html-out-of-order-without-javascript/
- Chrome for Developers. "A service worker's life." Accessed: Jan. 15, 2024. [Online]. Available: https://developer.chrome.com/docs/workbox/service-worker-lifecycle/#activation
- Chrome for Developers. "Service workers and the application shell model." Accessed: Jan. 15, 2024. [Online]. Available: https://developer.chrome.com/docs/workbox/app-shell-model
- DEV Community. "The Return of Server Side Routing." Accessed: Jan. 15, 2024. [Online]. Available: https://dev.to/this-is-learning/the-return-of-server-side-routing-b05
- C. Draycott-Wheatley. "Speed up your Eleventy site with a multi-page app shell." Accessed: Jun. 16, 2022. [Online]. Available: https://web.archive.org/web/20210420200133/https://chrisdwheatley.com/posts/speed-up-your-eleventy-site-with-a-multi-page-app-shell/
- eBay Inc. "Async Fragments: Rediscovering Progressive HTML Rendering with Marko." Accessed: Jan. 15, 2024. [Online]. Available: https://innovation.ebayinc.com/tech/engineering/async-fragments-rediscovering-progressive-html-rendering-with-marko/
- Gal Schlezinger. "Out of Order Streaming from Scratch." Accessed: Jan. 15, 2024. [Online]. Available: https://gal.hagever.com/posts/out-of-order-streaming-from-scratch
- B. Halpern. "Instant Webpages and Terabytes of Data Savings Through the Magic of Service Workers ✨." Accessed: Jun. 16, 2022. [Online]. Available: https://dev.to/devteam/instant-webpages-and-terabytes-of-data-savings-through-the-magic-of-service-workers-1mkc
- Jake Archibald. "Fun hacks for faster content." Accessed: Jan. 15, 2024. [Online]. Available: https://jakearchibald.com/2016/fun-hacks-faster-content/
- Jake Archibald. "The service worker lifecycle." Accessed: Jan. 15, 2024. [Online]. Available: https://web.dev/articles/service-worker-lifecycle?hl=en
- Jake Archibald. "Speed up service worker with navigation preloads." Accessed: Jan. 15, 2024. [Online]. Available: https://web.dev/blog/navigation-preload
- Jeff Posnick. "Bringing service workers to Google Search." Accessed: Jan. 15, 2024. [Online]. Available: https://web.dev/case-studies/google-search-sw#service-worker-overhead
- Nicolas Sander and Eugen Ackermann, "Progressive Web Apps als Alternative zu Webapplikationen und Ersatz zu nativen Apps," Master Thesis, Universität Paderborn, Paderborn, 2018. [Online]. Available: https://cs.uni-paderborn.de/fileadmin-eim/informatik/fg/mci/Masterarbeiten/2018/MA__Ackermann_Eugen__Sander__Nicolas.pdf
- R. O'leary. "Is Lighthouse a misleading performance tool?" Accessed: Jan. 15, 2024. [Online]. Available: https://www.roboleary.net/webdev/2023/07/06/lighthouse-misleading.html
- Ollie Williams. "The View Transitions API, the Navigation API and the SPA vs MPA debate." Accessed: Jan. 15, 2024. [Online]. Available: https://fullystacked.net/the-spa-vs-mpa-debate/
- A. Osmani, "A Pinterest Progressive Web App Performance Case Study," Dev Channel, 29 Nov., 2017. Accessed: Jan. 15, 2024. [Online]. Available: https://medium.com/dev-channel/a-pinterest-progressive-web-app-performance-case-study-3bd6ed2e6154
- Parbat Thakur, "Evaluation and Implementation of Progressive Web Application," Bachelor Thesis, Helsinki Metropolia University of Applied Sciences, Helsinki, 2018. [Online]. Available: https://www.theseus.fi/bitstream/handle/10024/142997/PWA%20thesis.pdf;jsessionid=8C6785F13364F914F795B42D2627831E?sequence=1
- Pascal Schilp. "Service Worker Templating Language (SWTL)." Accessed: Jan. 15, 2024. [Online]. Available: https://dev.to/thepassle/service-worker-templating-language-swtl-47e5
- Pascal Schilp. "I overengineered my blog." Accessed: Jan. 15, 2024. [Online]. Available: https://thepassle.netlify.app/blog/i-overengineered-my-blog
- J. Posnick. "Stream Your Way to Immediate Responses." Accessed: Jun. 16, 2022. [Online]. Available: https://developer.chrome.com/blog/sw-readablestreams/
- J. Posnick. "Beyond SPAs - alternative architectures for your PWA." Accessed: Jun. 16, 2022. [Online]. Available: https://developer.chrome.com/blog/beyond-spa/
- Read the Tea Leaves. "SPAs: theory versus practice." Accessed: Jan. 15, 2024. [Online]. Available: https://nolanlawson.com/2022/06/27/spas-theory-versus-practice/
- D. Renzulli and J. Posnick. "App shell UX with service workers and streams: Achieving a SPA-like architecture in multi-page apps by combining partials, service workers, and streams." Accessed: Jun. 16, 2022. [Online]. Available: https://web.dev/app-shell-ux-with-service-workers/
- A. Russell, "A Management Maturity Model for Performance," Alex Russell, 09 May., 2022. Accessed: Jan. 15, 2024. [Online]. Available: https://infrequently.org/2022/05/performance-management-maturity/
- P. Schmitt. "Die Zukunft des Frontends: Aktuelle Entwicklungen auf dem Spektrum zwischen Single Page Application und Multi Page Application." Webentwicklung: Trends im Bereich Frontend-Architektur. [Online]. Available: https://www.dotnetpro.de/frontend/zukunft-frontends-2810967.html
- Streaming Media Magazine. "A Stitch in Time: How Stream Stitching Beats the Ad Blockers." Accessed: Jan. 15, 2024. [Online]. Available: https://www.streamingmedia.com/Articles/Editorial/Featured-Articles/A-Stitch-in-Time-How-Stream-Stitching-Beats-the-Ad-Blockers-108810.aspx
- Victor, "Improving Performance with HTTP Streaming - The Airbnb Tech Blog - Medium," The Airbnb Tech Blog, 17 May., 2023. Accessed: Jan. 15, 2024. [Online]. Available: https://medium.com/airbnb-engineering/improving-performance-with-http-streaming-ba9e72c66408
- P. Walton. "Smaller HTML Payloads with Service Workers." Accessed: Jun. 16, 2022. [Online]. Available: https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/
- web.dev. "Advancing Interaction to Next Paint &nbsp;|&nbsp; web.dev." Accessed: Jan. 15, 2024. [Online]. Available: https://web.dev/blog/inp-cwv
- Weston Ruter. "Intent to unship: support for streaming responses." Accessed: Jan. 15, 2024.
- O. Williams. "Web Streams Everywhere (and Fetch for Node.js) | CSS-Tricks." Accessed: Jun. 16, 2022. [Online]. Available: https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/
 
 
 
 
 <style>
h1:not(.nocount), h2:not(.nocount), h3:not(.nocount) {
  opacity: 0; position: absolute; top: -300vh;
}
.TOC a {
  text-decoration: none; cursor: default;
}
[id="preliminary-bibliography"] ~ ul { text-align:left; padding:0; }
[id="preliminary-bibliography"] ~ ul li { margin-bottom: 4px; }
</style>
 