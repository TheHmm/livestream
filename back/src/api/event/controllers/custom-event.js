module.exports = {
  routes: [
    // { 
    //   method: 'GET',
    //   path: '/events/count',
    //   handler: 'event.count',
    // },
    { 
      method: 'GET',
      path: '/events/:id', 
      handler: 'event.findOne',
    },

  ]
}

 

 