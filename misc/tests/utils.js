const { randFullName } = require('@ngneat/falso')

function setRandomFullName(context, _events, done) {
  context.vars.fullName = randFullName()
  return done()
}

function setRandomPosition(context, _events, done) {
  context.vars.x = Math.random()
  context.vars.y = Math.random()
  return done()
}

module.exports = {
  setRandomFullName,
  setRandomPosition
}