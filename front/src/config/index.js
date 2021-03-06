import networking from "./networking"

const 


  // Environment file

  env         = import.meta.env,
  url         = env.VITE_APP_URL,
  socket_url  = env.VITE_APP_SOCKET_URL,
  api_url     = env.VITE_APP_API_URL,
  api_img_url = env.VITE_APP_IMG_URL,


  // Event default options

  events = {

    // How near in the future an event needs to be for
    // us to consider it as the upcoming event and to
    // attach the current livestream to it.

    TIME_BUFFER : 24 * 60 * 60 * 1000,  // 24 hours
  
  },


  // Markdown default options
  // https://marked.js.org/using_advanced#options

  md = {
    silent      : true,
    breaks      : true,
    // html        : true,
    // linkify     : true,
    // typographer : true,
    // emoji       : true,
  }

export default {
  url,
  socket_url,
  api_url,
  api_img_url,
  networking,
  md,
  events
}
