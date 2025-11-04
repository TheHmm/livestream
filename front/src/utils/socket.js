import config from '../config'
import socket from 'socket.io-client'
export default socket.io( config.socket_url, { autoConnect: false } )
