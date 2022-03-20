import config from "@/config"
import logger from "./logger"
import time from './time'
import livestream from './livestream'
import captions from './captions'
import { marked } from 'marked'


// produce an id or class from a component name
// 'this' refers to the component instance

function $id() {
  return this.$options?.name?.toLowerCase()
}

// Set default options of markdown parser.
marked.setOptions( config.md )

const 
  $md = marked.parse,
  $mdi = marked.parseInline


export {
  $id,
  $md,
  $mdi,
  logger,
  time,
  livestream,
  captions,
}
