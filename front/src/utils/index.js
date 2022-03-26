import { marked } from 'marked'
import config     from "@/config"
import $log       from "./log"
import $time      from './time'


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
  $log,
  $time,
  $id,
  $md,
  $mdi,
}
