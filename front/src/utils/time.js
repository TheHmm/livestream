// import moment     from 'moment-timezone'
import config     from "@/config"

const

  BUFFER = config.events.SOON_BUFFER,

  now = () => new Date().getTime(),

  time = timestring => ( new Date( timestring ) ).getTime(),

  to_hours = ms => ms / 3600000,

  // human_format = time => moment
  //   .tz( time, 'Europe/Amsterdam' )
  //   .format( 'dddd DD MMMM [at] HH:mm z' ),

  is_in_past   = timestring => time( timestring ) < now(),

  is_in_future = timestring => time( timestring ) > now(),

  is_soon      = timestring => ( 
    time( timestring ) > now() &&
    time( timestring ) < now() + BUFFER 
  )


export default {
  is_in_past,
  is_in_future,
  is_soon,
  to_hours,
  // human_format,
}
