module.exports = {
  routes: [
    { 
      method: 'GET',
      path: '/meta', 
      handler: 'meta.find',
    },
    { 
      method: 'POST',
      path: '/meta/donate', 
      handler: 'meta.donate',
    },
    { 
      method: 'POST',
      path: '/meta/donate/webhook', 
      handler: 'meta.webhook',
    }
  ]
}

 

 