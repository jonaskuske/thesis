if (import.meta.env.PUBLIC_ENV__DISABLE_SW !== 'true') {
  import('./initServiceWorker')
}
