import networking from "./networking"

const 


  // Environment file

  env        = import.meta.env,
  url        = env.VITE_APP_URL,
  api_url    = env.VITE_APP_API_URL,
  socket_url = env.VITE_APP_SOCKET_URL,


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
  url,
  api_url,
  socket_url,
  networking,
  md,
  events
}
