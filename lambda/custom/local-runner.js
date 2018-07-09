const skill = require('./index');
const log = require('./handlers/libs/log');
const request = require('./run-request-data.json');

skill.handler(request, {}, (err, result) => {
  if (err)
    log.error(err);

  log.info(result);
})