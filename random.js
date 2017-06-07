function generateRandomString() {
  var randomString = "";
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var stringLength = 6;

  function pickRandom() {
    return chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString = Array.apply(null, Array(stringLength)).map(pickRandom).join('');
}

// console.log(generateRandomString());

module.exports = generateRandomString;
