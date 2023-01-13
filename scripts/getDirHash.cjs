const {createHash} = require('crypto');
const {readFileSync} = require('fs');
const {lsrSync} = require('lsr');

module.exports = function getHash(dirname) {
  const hash = createHash('sha512');
  lsrSync(dirname, {
    filter: (entry) => entry.name[0] !== '.',
  }).forEach((entry) => {
    hash.update(entry.path);
    if (entry.isFile()) {
      hash.update(readFileSync(entry.fullPath));
    }
  });
  return hash.digest('hex');
};
