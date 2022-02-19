module.exports = {
  routes: [
    { // Path defined with a regular expression
      method: 'POST',
      path: '/mux-hook', 
      handler: 'mux-hook.create',
    }
  ]
}

 

 