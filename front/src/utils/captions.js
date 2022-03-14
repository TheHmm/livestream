export default {

  caption_to_srt: caption => {
    const { text, start, stop } = caption
    return (`
${start} --\> ${stop}
>> ${text}
`)
  },

  srt_to_vtt: content => {
    // console.log(content.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2'))
    return(

   content && window.URL.createObjectURL(
      new Blob([
        "WEBVTT - Generated using SRT2VTT\r\n\r\n" + 
        content.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2')
      ], { type: 'text/vtt' })
    )
  )}


}
