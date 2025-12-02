import 'dotenv/config'
import api from 'axios'
import convert from 'color-convert'
import fs from 'fs'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { FormData } from 'formdata-node'
import { blobFrom } from 'node-fetch';

const {
  OLD_API_URL,
  OLD_API_TOK,
  NEW_API_URL,
  NEW_API_TOK,
  NEW_ORG_DID,
  NEW_LIV_DID
 } = process.env


migrate()

async function migrate() {

  // First create announcements
  // await migrate_announcements()

  // Then create emoji groups
  // await migrate_emoji_groups()

  // Then create viewers
  // await migrate_viewers()

  // Then create messages
  // await migrate_messages()

  // Then create events
  // await migrate_events()
  
}










async function migrate_announcements() {
  console.log('Fetching old announcements...')
  const old_announcements = await fetch_old( 'announcements', {
    fields: '*',
    publicationState: 'preview',
    pagination: { pageSize: 300 }
  })
  for ( const old_announcement of old_announcements ) { 
    const new_announcement = clear_illegal_fields( old_announcement )
    await creat_new( 'announcements', new_announcement )
  }
}

async function migrate_emoji_groups() {
  console.log('Fetching old emoji-groups...')
  const old_emoji_groups = await fetch_old( 'emoji-groups', {
    fields: '*',
    populate: [             
      'emoji',
      'emoji.image',
    ],
    pagination: { pageSize: 300 }
  })
  for ( const old_emoji_group of old_emoji_groups ) { 
    const new_emoji_group = clear_illegal_fields( old_emoji_group )
    console.log('Re-uploading old emoji images...')
    for ( const old_emoji of new_emoji_group.emoji ) {
      const new_emoji = clear_illegal_fields( old_emoji )
      if ( new_emoji.image ) {
        const image = new_emoji.image.data
        if ( image.name.includes( '<' ) ) {
          image.name = 'hearttt'
        }
        await fetch_image( image.url, image.name, image.mime )
        const uploaded = await upload_image( image.name, image.mime )
        new_emoji.image = uploaded.data[0].id
      }
    }
    await creat_new( 'emoji-groups', new_emoji_group )
  }
}

async function migrate_viewers() {
  console.log('Fetching old viewers...')
  let page = 1
  let old_viewers = []
  async function fetch_more() {
    const viewers = await fetch_old( 'viewers', { 
      fields: '*', 
      pagination: { 
        pageSize: 300, 
        page 
      }
    })
    viewers.map( v => old_viewers.push(v) )
    if ( viewers.length > 0 ) {
      page++
      await fetch_more()
    }
  }
  await fetch_more()
  for ( const old_viewer of old_viewers ) { 
    if ( old_viewer.uuid.includes( 'anonymous' ) ) {
      old_viewer.uuid = old_viewer.uuid + '_' + old_viewer.id
    }
    const new_viewer = clear_illegal_fields( old_viewer )
    await creat_new( 'viewers', new_viewer )
  }
}

async function migrate_messages() {
  console.log('Fetching old messages...')
  let page = 1
  let old_messages = []
  async function fetch_more() {
    const message = await fetch_old( 'messages', { 
      fields: '*', 
      populate: [ 'sender' ], 
      pagination: { 
        pageSize: 300, page 
      }
    })
    message.map( v => old_messages.push(v) )
    if ( message.length > 0 ) {
      page++
      console.log( old_messages.length )
      await fetch_more()
    }
  }
  await fetch_more()
  console.log('Linking new viewers to new messages...')
  for ( const old_message of old_messages ) { 
    const new_message = clear_illegal_fields( old_message )
    const sender = new_message.sender?.data
    if ( sender && sender.uuid ) {
      let sender_uuid 
      if ( sender.uuid.includes( 'anonymous' ) ) {
        sender_uuid = sender.uuid + '_' + sender.id
      } else {
        sender_uuid = sender.uuid
      }
      const actual_sender = await fetch_new( 'viewers', 'uuid', sender_uuid )
      new_message.sender = actual_sender?.documentId
    } else {
      console.log( 'No sender' ) 
    }
    await creat_new( 'messages', new_message )
  }
}

async function migrate_events() {
  console.log('Fetching old events...')
  const old_events = await fetch_old( 'events', {
  fields: '*',
    populate: {            
      emoji_groups: { fields: 'slug' },
      announcements: { fields: 'slug', publicationState: 'preview' },
      viewers: { fields: 'uuid' },
      messages: { fields: 'time' }
    },
    pagination: { pageSize: 300 }
  } )
  console.log('Linking new announcements, emoji-groups, viewers, messages to new event...')
  for ( const old_event of old_events ) {
    const new_event = {
      title: old_event.title,
      slug: old_event.slug,
      starts: old_event.starts,
      ends: old_event.ends,
      organisation: NEW_ORG_DID,
      livestream: NEW_LIV_DID,
      default_player_mode: old_event.default_player_mode,
      allowEmoji: old_event.allowEmoji,
      show_in_agenda: true,   
      show_in_archive: true,
      info: old_event.info,
      background_color: hsl_to_hex( old_event.accent ),
      accent_color: complimentary_color( old_event.accent ),
      text_color: '#FFFFFF',
      mux_recording: old_event.mux_recording,
      later_visits: old_event.later_visits,
      count: old_event.count,
      announcements: [],
      emoji_groups: [],
      viewers: [],
      messages: []
    }
    for ( const { slug } of old_event.announcements.data ) {
      const announcement = await fetch_new( 'announcements', 'slug', slug )
      if ( announcement ) {
        new_event.announcements.push( announcement.documentId )
      } else {
        console.log( `Announcement ${ slug } not found.` )
      }
    }
    for ( const { slug } of old_event.emoji_groups.data ) {
      const emoji_group = await fetch_new( 'emoji-groups', 'slug', slug )
      if ( emoji_group ) {
        new_event.emoji_groups.push( emoji_group.documentId )
      } else {
        console.log( `Emoji group ${ slug } not found.` )
      }
    }
    for ( let { uuid, id } of old_event.viewers.data ) {
      if ( uuid.includes( 'anonymous' ) ) {
        uuid = uuid + '_' + id
      }
      const viewer = await fetch_new( 'viewers', 'uuid', uuid )
      if ( viewer ) {
        new_event.viewers.push( viewer.documentId )
      } else {
        console.log( `Viewer ${ uuid } not found.` )
      }
    }
    for ( const { time } of old_event.messages.data ) {
      const message = await fetch_new( 'messages', 'time', time )
      if ( message ) {
        new_event.messages.push( message.documentId )
      } else {
        console.log( `Message ${ time } not found.` )
      }
    }
    // console.log( new_event.slug, new_event.announcements.length, new_event.emoji_groups.length, new_event.viewers.length, new_event.messages.length )
    const result = await creat_new( 'events', new_event )
  }
}




async function creat_new( collection, data ) { 
  try {
    const result = await api.post( `${ NEW_API_URL }/${ collection }` , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${ NEW_API_TOK }`
      },
      data
    })
    console.log("Created entry: ", data.title || data.name || data.slug || data.body )
    return result
  } catch (error) {
    handle_axios_error( error )
  }
}

async function fetch_new( collection, id_field, id ) { 
  try {
    const { data } = await api.get( `${ NEW_API_URL }/${ collection }`, {

      params: {
        filters: {
          [id_field]: { $eq: id }
        }
      }
    })
    return data.data[0]
  } catch (error) {
    handle_axios_error( error )
  }
}

async function fetch_old( collection, params ) { 
  try {
    const { data } = await api.get( `${ OLD_API_URL }/${ collection }` , {
      headers: {
        'Authorization': `bearer ${ OLD_API_TOK }`
      },
      params
    })
    return data.data
  } catch (error) {
    handle_axios_error( error )
  }
}

async function upload_image( imageName, imageMime ) {
  const file = await blobFrom( './uploads/' + imageName, imageMime );
  const form = new FormData()
  form.append('files', file, imageName )
  return await api.post( NEW_API_URL + '/upload' , form)
}

async function fetch_image(imageUrl, imageName, imageMime) {
  const url = OLD_API_URL.replace('/api', '' ) + imageUrl
  const stream = fs.createWriteStream( './uploads/' + imageName )
  const { body } = await fetch(url)
  await finished(Readable.fromWeb(body).pipe(stream))
}


function handle_axios_error( error ) {
  if (error.response) {
    console.log( 'Error response: ' )
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.data?.error?.details);
    console.log(error.response.data?.error?.details?.errors);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log( 'Error request: ' )
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
} 

function clear_illegal_fields( data ) {
  delete data.id
  delete data.createdAt
  delete data.updatedAt
  delete data.publishedAt
  return data
}

function hsl_to_hex( hsl ) {
  const regexp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g
  const result = regexp.exec(hsl).slice(1)
  return '#' + convert.hsl.hex( result )
}

function complimentary_color( hsl ) {
  const regexp = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g
  const result = regexp.exec(hsl).slice(1)
  result[0] = (result[0] + 180) % 360
  return '#' + convert.hsl.hex( result )
}
