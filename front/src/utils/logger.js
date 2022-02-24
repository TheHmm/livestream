const 

  log = ( from, ...args ) => {
    for ( const arg of args ) {
      if ( typeof arg == 'object' ) {
        console.log( `- ${ from.toUpperCase() }:` )
        console.log( arg )
      } else {
        console.log( `- ${ from.toUpperCase() }: ${ arg }` )
      }
    }
  },

  info = ( from, ...args ) => {
    for ( const arg of args ) {
      if ( typeof arg == 'object' ) {
        console.info( `* ${ from.toUpperCase() }:` )
        console.info( arg )
      } else {
        console.info( `* ${ from.toUpperCase() }: ${ arg }` )
      }
    }
  },

  warn = ( from, ...args ) => {
    for ( const arg of args ) {
      console.warn(`! ${ from.toUpperCase() }: ${ arg }`)
    }
  },

  error = ( from, ...args ) => {
    for ( const arg of args ) {
      console.error(`x ${ from.toUpperCase() }: ${ arg }`)
    }
  },

  table = ( from, ...args ) => {
    for ( const arg of args ) {
      info(`x ${ from.toUpperCase() }:`)
      console.table(`x ${ from.toUpperCase() }: ${ arg }`)
    }
  },

  intro = config => {
    console.log ( )
    console.info( `* * * * * * * * * * * * * * * * * * * * * * * * * * *` )
    console.info( `* * * * * * * * * * * The Hmm * * * * * * * * * * * *` )
    console.info( `* * * * * * * * * * * * * * * * * * * * * * * * * * *` )
    console.info( `* API => ${ config.apiURL } *` ) 
    console.info( `* SOCKETS => ${ config.socketURL } *` ) 
    console.info( `* * * * * * * * * * * * * * * * * * * * * * * * * * *` )
    console.log ( )
  }

export default {
  log,
  info,
  warn,
  error,
  table,
  intro,
}
