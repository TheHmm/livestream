export default {


  // Easily get time in ms of datetime stamp and time in ms
  // of now.

  time : timestring => ( new Date( timestring ) ).getTime(),
  now  : () => new Date().getTime(),


  // Determining if event is in past

  BUFFER : 12 * 60 * 60 * 1000,  // 12 hours,
  is_in_past ( timestring ) {
    return this.time( timestring ) < ( this.now() - this.BUFFER )
  },


  // Formatterings

  long_date_format : starts => {
    return new Date( starts ).toLocaleString( 'en-GB', {
      year         : 'numeric',
      month        : 'long',
      day          : 'numeric',
      hour         : 'numeric',
      minute       : 'numeric',
      timeZoneName : 'short'
    })
  }, // => 3 August 2022 at 12:36 CEST


  short_date_format : starts => {
    return new Date( starts ).toLocaleString( 'en-GB', {
      year         : 'numeric',
      month        : 'long',
      day          : 'numeric',
    })
  }, // => 30 June 2022


  time_format : datetime => {
    return new Date( datetime ).toLocaleString( 'en-GB', {
      hour         : 'numeric',
      minute       : 'numeric',
      second       : 'numeric',
    })
  }, // => 21:22:34


  get_year :  timestamp => {
    return new Date( timestamp ).getFullYear()
  }, // => 2022


  dur_format : dur => {
    return new Date( dur ).toISOString().slice(11,19)
  }  // => 13:09:49

}
