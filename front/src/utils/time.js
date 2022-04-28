// import moment     from 'moment-timezone'
import config     from "@/config"

const

  BUFFER = config.events.TIME_BUFFER,

  now = () => new Date().getTime(),

  time = timestring => ( new Date( timestring ) ).getTime(),

  to_hours = ms => ms / 3600000,

  // human_format = time => moment
  //   .tz( time, 'Europe/Amsterdam' )
  //   .format( 'dddd DD MMMM [at] HH:mm z' ),

  date_format = starts => (
    new Date( starts )
    .toLocaleString( 'en-GB', { 
      year         : 'numeric',
      month        : 'long',
      day          : 'numeric',
      hour         : 'numeric',
      minute       : 'numeric',
      timeZoneName : 'short'
      // timeZone  : 'CET',
    } ) 
  ),

  time_format = datetime => (
    new Date( datetime )
    .toLocaleString( 'en-GB', { 
      hour         : 'numeric',
      minute       : 'numeric',
      second       : 'numeric',
    } ) 
  ),

  dur_format = dur => (
    new Date( dur )
    .toISOString()
    .slice(11,19)
  ),

  // is_in_past   = timestring => time( timestring ) < now(),
  is_in_past   = timestring => time( timestring ) < ( now() - BUFFER ),

  is_in_future = timestring => time( timestring ) > now(),

  is_soon      = timestring => ( 
    time( timestring ) > now() &&
    time( timestring ) < now() + BUFFER 
  ),

  time_to_srt_stamp = time => {
    const date = new Date( 0 )
		date.setSeconds( time/1000 )
		let stamp = date.toISOString().replace(".",",").replace("1970-01-01T","")
		stamp = stamp.substring(0, stamp.length - 1)
    console.log(stamp)
    return stamp
  }


export default {
  time,
  now,
  is_in_past,
  is_in_future,
  is_soon,
  to_hours,
  time_to_srt_stamp,
  date_format,
  time_format,
  dur_format,
}
