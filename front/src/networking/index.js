import tools    from './tools'
import methods  from './methods'
import watchers from './watchers'
import mux      from './mux'


// Network utilities: These functions try to
// track the website's network activity

// This is an SPA, so a lot has hacked together 
// to make this work. It cannot be 100% accurate.
// For example we can't access the browser's cache
// to see if assets have been loaded from there. 

// The chosen approach is to over-calculate

const 

  init = ( axios, io ) => {

    watchers.strapi_monitor.init( axios )
    watchers.socket_monitor.init( io )
    watchers.asset_observer.init()

    methods.head_assets()

  }


export default {
  tools,
  methods,
  watchers,
  mux,
  init
}
