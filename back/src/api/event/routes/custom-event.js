module.exports = {
  routes: [
    {
      method: 'PATCH',
      path: '/events/:slug/visit',
      handler: 'event.log_visit',
    },
  ]
}
