
/*
 *
 * ============================================================
 * WARNING: THIS FILE HAS BEEN COMMENTED OUT
 * ============================================================
 *
 * CONTEXT:
 *
 * The lifecycles.js file has been commented out to prevent unintended side effects when starting Strapi 5 for the first time after migrating to the document service.
 *
 * STRAPI 5 introduces a new document service that handles lifecycles differently compared to previous versions. Without migrating your lifecycles to document service middlewares, you may experience issues such as:
 *
 * - `unpublish` actions triggering `delete` lifecycles for every locale with a published entity, which differs from the expected behavior in v4.
 * - `discardDraft` actions triggering both `create` and `delete` lifecycles, leading to potential confusion.
 *
 * MIGRATION GUIDE:
 *
 * For a thorough guide on migrating your lifecycles to document service middlewares, please refer to the following link:
 * [Document Services Middlewares Migration Guide](https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)
 *
 * IMPORTANT:
 *
 * Simply uncommenting this file without following the migration guide may result in unexpected behavior and inconsistencies. Ensure that you have completed the migration process before re-enabling this file.
 *
 * ============================================================
 */

// const
// 
// 
//   unpublish = async id => {
//     try {
//       await strapi
//       .service('api::announcement.announcement')
//       .update( id, { data: { publishedAt: null } } )
//     } catch ( error ) {
//       console.log(error)
//     }
//   },
// 
//   after_create_or_update = async event => {
//     const announcement = { ...event.params.data, ...event.result }
//     strapi.io.emit( 'announcement', announcement )
// 
//     if ( 
//         announcement.publishedAt &&
//         announcement.expires 
//       ) {
//       console.log('setting timeout', announcement.id)
//       setTimeout( async () => {
//         await unpublish( announcement.id )
//       }, announcement.expires * 1000 )
//     }
//   },
// 
//   after_delete = event => {
//     const announcement = {
//       id: event.result.id,
//       deleted: true
//     }
//     strapi.io.emit( 'announcement', announcement )
//   }
// 
// 
// 
// 
// module.exports = {
// 
//   afterCreate: after_create_or_update,
//   afterUpdate: after_create_or_update,
// 
//   afterDelete: after_delete,
// 
// }
// 