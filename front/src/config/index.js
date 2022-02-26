const 


  // Environment file

  env       = import.meta.env,
  URL       = env.VITE_APP_URL,
  apiURL    = env.VITE_APP_API_URL,
  socketURL = env.VITE_APP_SOCKET_URL,


  // Event default options

  events = {

    // How near in the future an event needs to be for
    // us to consider it as the upcoming event and to
    // attach the current livestream to it.

    SOON_BUFFER : 12 * 60 * 60 * 1000,  // 12 hours
  
  },


  // Markdown default options

  md = {
    html        : true,
    linkify     : true,
    typographer : true,
    emoji       : true,
    breaks      : true,
  }

export default {
  URL,
  apiURL,
  socketURL,
  md,
  events
}
