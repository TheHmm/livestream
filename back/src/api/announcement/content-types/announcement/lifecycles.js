const


  unpublish = async id => {
    try {
      await strapi
      .service('api::announcement.announcement')
      .update( id, { data: { publishedAt: null } } )
    } catch ( error ) {
      console.log(error)
    }
  },

  after_create_or_update = async event => {
    const announcement = { ...event.params.data, ...event.result }
    strapi.io.emit( 'announcement', announcement )

    if ( announcement.publishedAt ) {
      console.log('setting timeout', announcement.id)
      setTimeout( async () => {
        await unpublish( announcement.id )
      }, announcement.expires * 1000 )
    }
  },

  after_delete = event => {
    const announcement = {
      id: event.result.id,
      deleted: true
    }
    strapi.io.emit( 'announcement', announcement )
  }




module.exports = {

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,

  afterDelete: after_delete,

}
