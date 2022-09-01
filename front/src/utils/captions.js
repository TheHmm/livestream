import { WebVTTParser } from 'webvtt-parser'

export default {

  parse_vtt: vtt => {
    const parser = new WebVTTParser()
    const parsed = parser.parse( vtt )
    const cues = parsed.cues
    for ( let i = 0; i < cues.length; i ++ ) {
      cues[i].id = i
    }
    return cues
  }

}
