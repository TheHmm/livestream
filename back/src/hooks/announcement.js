
const

  after_create_or_update = async (context, result) => {
    const announcement = { ...context.params.data, ...result }
    strapi.io.emit( 'announcement', announcement )
    if ( 
        announcement.show &&
        announcement.expires 
    ) {
      console.log('setting timeout', announcement.documentId)
      setTimeout( async () => {
        try {
          await strapi
          .documents('api::announcement.announcement')
          .update({ 
            documentId: announcement.documentId,
            data: { show: false } 
          })
        } catch ( error ) {
          console.log(error)
        }
      }, announcement.expires * 1000 )
    }
  },

  after_delete = result => {
    strapi.io.emit( 'announcement', {
      documentId: result.documentId,
      deleted: true
    })
  }


  // 
//   afterCreate: after_create_or_update,
//   afterUpdate: after_create_or_update,
// 
//   afterDelete: after_delete,
// 


module.exports = {
  announcement_hooks() {
    return async ( context, next ) => {

      const { uid, action } = context
      let result = await next()

      if (uid == 'api::announcement.announcement') {
        // after create or update 
        if ( ['create', 'update'].includes(action) ) {  
          await after_create_or_update( context, result )
        } else if ( action == 'delete' ) {
          await after_delete( result )
        } 
      }

      return result
    }
  }
}