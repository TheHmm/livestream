
const 

  hsl_regwx = /^(?:hsl)?\(?(\d{1,3}),\s*(\d{1,3}%),\s*(\d{1,3}%)\)?$/,

  parse_hsl = hsl_string => {
    const bytes = hsl_regwx.exec( hsl_string )
    return {
      h : parseFloat( bytes[1] ), 
      s : parseFloat( bytes[2] ), 
      l : parseFloat( bytes[3] )
    }
  },

  hsl_to_css_vars =  hsl_string => {
    const { h, s, l } = parse_hsl( hsl_string )
    return {
      '--h': h,
      '--s': s + '%',
      '--l': l + '%'
    }
  }


export default {
  parse_hsl,
  hsl_to_css_vars
}
