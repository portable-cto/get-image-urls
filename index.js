const { URL } = require('url');
const fetch = require('node-fetch');
let auth;

function getScreenshot(urlObject) {
  const baseUrl = 'https://image.thum.io/get/auth/' + auth + '/';

  return baseUrl + urlObject.origin;
}

async function getLogo(urlObject) {
  const baseUrl = 'https://logo.clearbit.com/';

  if (await fetch(baseUrl + urlObject.origin).then(res => res.ok)) {
    return baseUrl + urlObject.origin;
  } else if (await fetch(baseUrl + urlObject.host).then(res => res.ok)) {
    return baseUrl + urlObject.host;
  } else {
    return undefined;
  }
}

function getUrlObject(url) {
  return new URL(url);
}

async function run(url) {
  const urlObject = getUrlObject(url);

  const logo = await getLogo(urlObject);
  const screenshot = await getScreenshot(urlObject);

  return {
    logo,
    screenshot,
    url,
  };
}
module.exports = function(context, cb) {
  auth = context.secrets.THUM_API_KEY;
  run(context.query.url)
    .then(res => cb(null, res))
    .catch(err => cb(err));
};
