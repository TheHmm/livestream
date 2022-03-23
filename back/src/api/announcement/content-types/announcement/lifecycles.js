const

  before_create_or_update = event => {
    const 
      announcement = event.params.data,
      expires      = announcement.expires

    console.log(event)

    
    

  },

  after_create_or_update = event => {
    const announcement = { ...event.params.data, ...event.result }
    console.log( announcement )
    strapi.io.emit( 'announcement', announcement )
  },

  after_delete = event => {
    const announcement = {
      id: event.result.id,
      deleted: true
    }
    strapi.io.emit( 'announcement', announcement )
  }




module.exports = {

  beforeCreate: before_create_or_update,
  beforeUpdate: before_create_or_update,

  afterCreate: after_create_or_update,
  afterUpdate: after_create_or_update,

  afterDelete: after_delete,

}
