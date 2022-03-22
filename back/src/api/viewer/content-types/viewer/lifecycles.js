const

  slugify = require('slugify'),


  before_create_or_update = async ( event, strapi ) => {

    // we get the event payload

    const viewer = event.params.data
    
    
    if ( viewer.name && !viewer.uuid ) {
      event.params.uuid = slugify( viewer.name , { lower: true } )
    }
    console.log(event.params)

  },

  after_create_or_update = event => {
    strapi.io.emit( 'viewer', event.result )
  }




module.exports = {

  async beforeCreate( event ) { await before_create_or_update( event, strapi ) },
  async beforeUpdate( event ) { await before_create_or_update( event, strapi ) },

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,

}