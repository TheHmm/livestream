
const

  after_create_or_update = async result => {
    const documentId = result.documentId
    const announcement = await strapi.documents('api::announcement.announcement').findOne({ 
      documentId, fields: '*', populate: { events: { fields: 'slug' } } 
    })
    if ( !announcement ) {
      return
    }
    for ( const event of announcement.events ) {
      strapi.io.to(event.slug).emit( 'announcement', announcement )
    }
    if ( 
        announcement.show &&
        announcement.expires 
    ) {
      console.log('setting timeout', announcement.documentId)
      setTimeout( async () => {
        try {
          await strapi.documents('api::announcement.announcement').update({ 
            documentId, data: { show: false } })
        } catch ( error ) {
          console.log(error)
        }
      }, announcement.expires * 1000 )
    }
  },

  after_delete = async result => {
    strapi.io.emit( 'announcement', {
      documentId : result.documentId,
      deleted : true
    })
  }

module.exports = {
  announcement_hooks() {
    return async ( context, next ) => {

      const { uid, action } = context
      let result = await next()

      if (uid == 'api::announcement.announcement') {
        // after create or update 
        if ( ['create', 'update'].includes(action) ) {  
          await after_create_or_update( result )
        } else if ( action == 'delete' ) {
          await after_delete( result )
        } 
      }

      return result
    }
  }
}