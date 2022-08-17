import { WebVTTParser } from 'webvtt-parser'

export default {


  // to_timestamp: time => {
  //   const zero_date = new Date(0)
  //   zero_date.setSeconds(time/1000)
	// 	let timestamp = zero_date.toISOString().replace(".",",").replace("1970-01-01T","")
	//   timestamp = timestamp.substring(0, timestamp.length - 1)
  //   return timestamp
  // },

  // caption_to_srt( caption, stream_start, latency ) {
  //   console.log(caption.start, latency)
  //   const
  //     { text, start, stop } = caption,
  //     start_stamp = this.to_timestamp( start - stream_start - latency  ),
  //     stop_stamp  = this.to_timestamp( stop  - stream_start - latency  )
  //   return (`\n${start_stamp} --\> ${stop_stamp}\n>> ${text}\n\n`)
  // },

  // srt_to_vtt: content => {
  //   const header = 'WEBVTT - Generated using SRT2VTT \r\n\r\n'
  //   return content && content.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2')
  // },



  // vtt_to_blob: vtt => {
  //   return window.URL.createObjectURL(
  //     new Blob( [ vtt ], { type: 'text/vtt' } )
  //   )
  // },

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
