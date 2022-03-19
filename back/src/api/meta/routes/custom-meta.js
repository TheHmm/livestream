module.exports = {
  routes: [
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

 

 