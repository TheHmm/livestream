const 


  // Environment file

  env       = import.meta.env,
  URL       = env.VITE_APP_URL,
  apiURL    = env.VITE_APP_API_URL,
  socketURL = env.VITE_APP_SOCKET_URL,


  // Other defaults

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
  md
}
