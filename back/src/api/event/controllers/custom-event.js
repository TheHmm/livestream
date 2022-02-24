module.exports = {
  routes: [
    { 
      method: 'GET',
      path: '/events/:id', 
      handler: 'event.findOne',
    }
  ]
}

 

 