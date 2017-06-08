// We get an error if the protocol is not included in the link
// Links without a valid protocol are modified to use HTTPS and returned

function protocolChecker(url) {
if (((url.substring(0,7)) === 'http://') || ((url.substring(0,8)) === 'https://')) {
  return url;
} else {
  let correctedURL = (`https://${url}`);
  return correctedURL;
  }
};

module.exports = protocolChecker;
