export default {
  srt_to_vtt: content => (
    window.URL.createObjectURL(
      new Blob([
        "WEBVTT - Generated using SRT2VTT\r\n\r\n" + 
        content.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2')
      ], { type: 'text/vtt' })
    )
  )
}
