const


  // Environment file

  env         = import.meta.env,
  url         = env.VITE_APP_URL,
  socket_url  = env.VITE_APP_SOCKET_URL,
  api_url     = env.VITE_APP_API_URL,
  api_img_url = env.VITE_APP_IMG_URL,


  // Markdown default options
  // https://marked.js.org/using_advanced#options

  md = {
    silent      : true,
    breaks      : true,
  },

  default_colors = {
    '--back': 'var(--blue)',
    '--fore': 'var(--black)',
    '--accent': 'var(--yellow)',
  }

export default {
  url,
  socket_url,
  api_url,
  api_img_url,
  md,
  default_colors
}
