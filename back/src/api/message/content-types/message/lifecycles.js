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
    
  },

  after_create_or_update = event => {
    strapi.io.emit( 'message', event.result )
  }




module.exports = {

  async beforeCreate( event ) { get_links( event, strapi ) },
  async beforeUpdate( event ) { get_links( event, strapi ) },

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,

}
