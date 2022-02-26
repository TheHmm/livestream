import config from "../config"


const

  BUFFER = config.events.SOON_BUFFER,

  now = () => new Date().getTime(),

  time = timestring => ( new Date( timestring ) ).getTime(),

  is_in_past   = timestring => time( timestring ) < now() ,
  is_in_future = timestring => time( timestring ) > now() ,
  is_soon      = timestring => ( 
    time( timestring ) > now() &&
    time( timestring ) < now() + BUFFER 
  )

export default {
  is_in_past,
  is_in_future,
  is_soon,
}
