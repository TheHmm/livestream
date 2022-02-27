import moment     from 'moment-timezone'
import config     from "@/config"
// import { logger } from '.'

const

  BUFFER = config.events.SOON_BUFFER,

  now = () => new Date().getTime(),

  time = timestring => ( new Date( timestring ) ).getTime(),

  is_in_past   = timestring => time( timestring ) < now(),

  is_in_future = timestring => time( timestring ) > now(),

  is_soon      = timestring => ( 
    time( timestring ) > now() &&
    time( timestring ) < now() + BUFFER 
  ),

  // did_event_end = event => { 
  //   const till_end = to_hours( time( event.ends ) - now() )
  //   logger.info( 'TIME', `The event ends in ${ till_end } hours` )
  //   return is_in_past( event.ends )
  // },

  to_hours = ms => ms / 3600000,

  human_format = time => moment
    .tz( time, 'Europe/Amsterdam' )
    .format( 'dddd DD MMMM [at] HH:mm z' )



export default {
  is_in_past,
  is_in_future,
  is_soon,
  // did_event_end,
  to_hours,
  human_format,
}
