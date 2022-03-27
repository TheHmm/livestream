import { marked } from 'marked'
import config     from "@/config"


// https://github.com/markedjs/marked/issues/655
  
const 
  renderer      = new marked.Renderer(),
  link_renderer = renderer.link

renderer.link = ( href, title, text ) => {

  const 
    // is_local = href.startsWith( `${location.protocol}//${location.hostname}` ),
    is_local = href.startsWith( `${ config.md.baseUrl }` ),
    html     = link_renderer.call( renderer, href, title, text )

  return is_local ? html : html.replace(/^<a /, `
    <a 
      target="_blank" 
      title="${ title || href }" 
      rel="noreferrer noopener nofollow"
    `
  )
}


config.md.renderer = renderer

// Set default options of markdown parser.
marked.setOptions( config.md )

const 

    $md  = marked.parse,
    $mdi = marked.parseInline


export {
  $md,
  $mdi
}
