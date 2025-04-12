<h1 class=nocount>Abstract</h1>

| Title       |   Stream Stitching and the App Shell Model |
| :---------- | -----------------------------------------: |
| Author      |                                Jonas Kuske |
| Examiner    |                            Marcos Martinez |
| Institution | University of Applied Sciences Bremerhaven |
| Course      |             Digital Media Production, B.A. |
| Date        |                                 2024/05/14 |

<br><style>th:last-child{width:70%}</style>

This bachelor thesis investigates the advantages of combining the app shell model with stream stitching. It compares the three dominant web application architectural paradigms *single-page application*, *multi-page application* and *isomorphic application*. It investigates how the app shell model impacts the different architectural paradigms through an experimental approach. A set of application variants is developed, each following one of the aforementioned architectural paradigms but otherwise identical in design and functionality. These variants are used to run benchmarks and gather performance data. Based on the collected performance data, the thesis shows that applying the app shell model is beneficial to all investigated paradigms, but especially benefits multi-page applications. The app shell model drastically improves the performance characteristics of multi-page application architecture and thus its field of application. Yet, significant downsides of multi-page application architecture remain, like the inability to implement page transitions or persist elements and state across navigations.

+++
# List of Figures

<div class="TOC TOC-figure">

- <a>Simplified diagram of the request/response cycle. <i num=3></i></a>
- <a>When navigating from A to B, the scroll position of the sidebar and the state of the expandable info texts are reset.<i num=4></i></a>
- <a>Flow diagram for the initial load of a single-page application.<i num=7></i></a>
- <a>Life cycle of a service worker.<i num=11></i></a>
- <a>Navigation Preload bypasses the service worker, so the server responds with regular HTML.<i num=13></i></a>
- <a>Thanks to the special header, the server detects the service worker and only sends data.<i num=13></i></a>
- <a>Design concept for sample application ISS Tracker [44].<i num=18></i></a>
- <a>Sample code that calls different functions depending on environment variable PUBLIC_ENV_MODE.<i num=22></i></a>
- <a>A Vue Component with placeholder props, wrapped in a template.<i num=22></i></a>
- <a>Sample code that clones, configures and renders a template for each given result.<i num=23></i></a>
- <a>Service worker code that uses the cache but falls back to the network to respond to a request.<i num=24></i></a>
- <a>Service worker code that uses stream stitching to respond to "navigate" requests.<i num=25></i></a>
- <a>Process flow when hashes match and when hashes differ. <i num=26></i></a>
- <a>Optimized flow when hashes differ.<i num=27></i></a>
- <a>Index screen in its initial empty state, after a search and after a location was added.<i num=31></i></a>
- <a>Location detail screen with the first card expanded, with the third card expanded, and location settings.<i num=32></i></a>
- <a>Settings screen in its initial state and after the user logged in.<i num=32></i></a>

</div>

# List of Tables

<div class="TOC TOC-table" style="margin-bottom:0">

- <a>Tools used for the test application across server and client. <i num=21></i>
- <a>Test Results for the SPA variant.<i num=33></i>
- <a>Test Results for the MPA variant.<i num=33></i>
- <a>Test Results for the Isomorphic App variant.<i num=34></i>
- <a>Test Results for the SPA + App Shell variant.<i num=34></i>
- <a>Test Results for the MPA + App Shell variant.<i num=35></i>
- <a>Results per individual step of the MPA + App Shell test flow.<i num=35></i>
- <a>Test Results for the Isomorphism + App Shell variant.<i num=36></i>
</div>

+++
# List of Abbreviations and Acronyms

**AJAX**:	Asynchronous JavaScript and XML  
**API**:	Application programming interface  
**App**:	Application  
**avg**:	average  
**bfcache**:	backward/forward cache  
**CLI**:	Command-line interface  
**CSR**:	Client-side rendering  
**CSS**:	Cascading Style Sheets  
**DOM**:	Document Object Model  
**HTML**:	Hypertext Markup Language  
**HTTP**:	Hypertext Transfer Protocol  
**ISS**:	International Space Station  
**JS**:	JavaScript  
**JSON**:	JavaScript Object Notation  
**KiB**:	Kibibyte (1024 bytes)  
**Mdn**:	Median  
**MPA**:	Multi-page application  
**ms**:		milliseconds  
**PWA**:	Progressive Web App  
**RAM**:	Random Access Memory  
**SPA**:	Single-page application  
**SSAI**:	Server-Side Ad Insertion  
**SSD**:	Solid State Drive  
**SSR**:	Server-side rendering  
**SW**:		Service Worker  
**swtl**:	Service Worker Templating Language  
**Subs.**:	Subsequent  
**UI**:		User Interface  
**URL**:	Uniform Resource Locator  
**UX**:	User Experience  
**V8**:	JavaScript Engine used in Node.js and Blink  
**vCPU**:	virtual Central Processing Unit  
**XML**:	Extensible Markup Language  



+++
# Declaration of Academic Integrity

I hereby confirm that the present thesis

> Stream Stitching and the App Shell Model  
> Accelerating Multi-Page App Rendering Through Service Workers

is the result of my own independent scholarly work, and that in all cases material from the work of 
others (in books, articles, essays, dissertations, and on the internet) is acknowledged, and
quotations and paraphrases are clearly indicated. No material other than that listed has been used.
I have read and understood the Institute’s regulations and procedures concerning plagiarism.

*German*:

Hiermit versichere ich eidesstattlich, dass ich die vorliegende Arbeit selbstständig und ohne Benutzung anderer als der angegebenen Hilfsmittel angefertigt habe.

Alle Stellen, die wörtlich oder sinngemäß aus veröffentlichten und nicht veröffentlichten Schriften entnommen sind, wurden als solche unter Angabe der Quelle kenntlich gemacht.

Die Arbeit wurde in gleicher oder ähnlicher Form keinem anderen Prüfungsamt vorgelegt. Mir ist bewusst, dass eine falsche Erklärung rechtliche Folgen haben wird.

<br><br>

\_______________________  
Heidelberg, 2024/05/14  
Jonas Kuske

<style>
h1:not(.nocount)::before {content: counter(h1, lower-roman) '. ' !important}
.TOC > ul > li a:empty { display: none; }
.TOC-figure > ul > li::before {content: 'Figure 'counter(item, decimal-leading-zero)':    ';white-space:pre}
.TOC-table > ul > li::before {content: 'Table 'counter(item)':    ';white-space:pre}
</style>