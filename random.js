function generateRandomString() {
  var randomString = "";
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let stringLength = 6;

  function pickRandom() {
    return chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString = Array.apply(null, Array(stringLength)).map(pickRandom).join('');
}

// console.log(generateRandomString());

module.exports = generateRandomString;
