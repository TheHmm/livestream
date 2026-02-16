

module.exports = {
   meta_hooks() {
    return async ( context, next ) => {

      // before create or update 
      const { uid, action } = context
      if (uid == 'api::meta.meta' && [ 'create', 'update' ].includes( action )) {
      }
      
      return next()
    }
  }
}