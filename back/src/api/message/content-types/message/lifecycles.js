const

  get_links = ( event, strapi ) => {

    const 
      message = event.params.data,
      body    = message.body,
      links   = body.match( /(((https?:\/\/)|(www\.))[^\s]+)/g)

    if ( links ) {
      event.params.data.links = [ ...new Set( links ) ]
    } else {
      event.params.data.links = null
    }
    
  }




module.exports = {

  async beforeCreate( event ) { get_links( event, strapi ) },
  async beforeUpdate( event ) { get_links( event, strapi ) },

}
