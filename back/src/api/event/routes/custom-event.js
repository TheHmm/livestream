module.exports = {
  routes: [
    {
      method: 'PATCH',
      path: '/events/:slug/visit',
      handler: 'event.log_visit',
    },
    {
      method: "POST",
      path: "/events/:slug/password",
      handler: "event.find_one_with_password"
    }
  ]
}
