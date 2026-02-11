module.exports = {
  routes: [
    {
      method: "POST",
      path: "/livestreams/:slug/authenticate",
      handler: "livestream.authenticate"
    }
  ]
}
