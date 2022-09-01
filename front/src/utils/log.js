// Custom logger


const

  log = ( from, ...args ) => {
    for ( const arg of args ) {
      if ( typeof arg == 'object' ) {
        console.log( `${ from.toUpperCase() }:` )
        console.log( arg )
      } else {
        console.log( `${ from.toUpperCase() }: ${ arg }` )
      }
    }
  },

  info = ( from, ...args ) => {
    for ( const arg of args ) {
      if ( typeof arg == 'object' ) {
        console.info( `${ from.toUpperCase() }:` )
        console.info( arg )
      } else {
        console.info( `${ from.toUpperCase() }: ${ arg }` )
      }
    }
  },

  warn = ( from, ...args ) => {
    for ( const arg of args ) {
      console.warn(`${ from.toUpperCase() }: ${ arg }`)
    }
  },

  error = ( from, ...args ) => {
    for ( const arg of args ) {
      console.error(`${ from.toUpperCase() }: ${ arg }`)
    }
  },

  table = ( from, ...args ) => {
    for ( const arg of args ) {
      info(`${ from.toUpperCase() }:`)
      console.table(`${ from.toUpperCase() }: ${ arg }`)
    }
  },

  intro = config => {
    console.info( `* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *` )
    console.info( `* * * * * * * * * * * * * The Hmm * * * * * * * * * * * * *` )
    console.info( `* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *` )
    console.info( `STATIC URL => ${ config.url }` )
    console.info( `STRAPI URL => ${ config.api_url }` )
    console.info( `SOCKET URL => ${ config.socket_url }` )
    console.info( `* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *` )
  }

export default {
  log,
  info,
  warn,
  error,
  table,
  intro,
}
