const

  // slugify = require('slugify'),


  before_create_or_update = async ( event, strapi ) => {

    // we get the event payload

    const viewer = event.params.data
    console.log(event, viewer)

    
    // if (viewer.name) {
    //   viewer.uuid = slugify(data.title, { lower: true })
    // }
  },

  after_create_or_update = event => {
    // strapi.io.emit( 'stream_update', event.result )
  }




module.exports = {

  async beforeCreate( event ) { await before_create_or_update( event, strapi ) },
  async beforeUpdate( event ) { await before_create_or_update( event, strapi ) },

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,

}
