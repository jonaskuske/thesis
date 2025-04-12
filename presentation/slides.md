---
theme: default
background: "#15003f"
color: "#ffffff"
title: Stream Stitching and the App Shell Model
favicon: /favicons/favicon.ico
author: Jonas Kuske
htmlAttrs:
  lang: de
class: text-center text-white
transition: slide-left
routerMode: hash
drawings:
  presenterOnly: true
mdc: false
monaco: false
---

<style>* {font-family: 'Space Grotesk'}</style>

# Stream Stitching<br>and the App Shell Model

Accelerating Multi-Page App Rendering Through Service Workers

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Space <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: section
---

# Architekturen im Vergleich

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(177.54deg, #06002c 21.39%, #45017b 142.67%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
layout: statement
---

# Multi Page Application
"Traditionelle" Website

HTML wird von Server bei jeder Interaktion neu generiert und geladen
<br>Beispiel: WordPress

---
layout: two-cols-header
---

# Multi Page Application

::left::

## Vorteile

- Schneller initialer Seitenaufruf
- Inhalt statisch analysierbar (gut für SEO)
- technische Flexibilität (Tools, Sprachen)

::right::


## Nachteile

- Navigationen & Interaktionen langsam
- Keine persistenten Elemente
- Zustand geht verloren

---
layout: statement
---

# Single Page Application

Interaktive App

Endgerät lädt allen Code und generiert HTML selbstständig
<br>Beispiel: Twitter

---
layout: two-cols-header
---

# Single Page Application

::left::

## Vorteile

- Schnelle Navigation & Interaktion
- Komplexe Interaktionen möglich
- Frontend & Backend getrennt entwickelbar

::right::


## Nachteile

- Initialer Seitenaufruf langsam
- Inhalt nicht statisch analysierbar
- Komplexität & Fehleranfälligkeit

---
layout: statement
---

# Isomorphic Application

Best of both worlds

Initiales HTML von Server generiert, ab dann lädt Endgerät selbstständig

---
layout: two-cols-header
---

# Isomorphic Application

::left::

## Vorteile

- Schneller initialer Seitenaufruf
- Schnelle Navigation & Interaktion
- Inhalte statisch analysierbar

::right::


## Nachteile

- Enge Kopplung von Frontend & Backend
- Weiterhin große Mengen JavaScript
- Komplexität & Fehleranfälligkeit

---
layout: section
---

# App Shell

---

# App Shell

- ermöglicht durch Service Worker
- Proxy, kann Netzwerkabfragen abfangen und selbst beantworten
- Zugriff auf lokalen Cache
- statische Teile der Seite (Shell) werden lokal vorgehalten und sofort ausgeliefert
- etabliert für SPAs, dank Stream Stitching auch für MPA & Isomorphic möglich

---
layout: section
---

# Tests

---
layout: iframe-right
url: https://thesis.joku.co
---

# Beispiel-App

<p class="mt-64">
Eine Codebase, mehrere Architekturen
</p>

- basierend auf Vike & Vue
- konfigurierbar durch Umgebungsvariablen
- eigener Service Worker
- [github.com/jonaskuske/thesis](http://github.com/jonaskuske/thesis)

---


<img class="auto" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPk7m7gm4agzG2KDXw6Ha6cagEReg-SuaTHQ&s">


- Etabliertes Tool für Performance-Tests
- Test anhand von eigens definiertem User Flow
- Metrik "Render" und "visualComplete99"

---
layout: fact
---

# 1000ms → 200ms

"render (Mdn)" bei MPAs ohne und mit App Shell

---
layout: statement
---

# Fazit

<div>
<p>App Shell kann Multi Page Applications massiv beschleunigen</p>
<p>Macht Performance der MPA Architektur kompetitiv</p>
<p>Andere Nachteile wie fehlende Persistenz bleiben aber</p>
</div>

---
layout: end
---

# Ausblick & Chancen

- Umfassendere Datenauswertung
- In mehr Umgebungen testen
- Komplexere, realitätsnähere Beispiel-App
- Andere Architekturansätze miteinbeziehen