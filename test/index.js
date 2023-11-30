const assert = require('assert');
const main = require('..');

describe('shake-video-element', () => {
  it('returns with placeholder', () => {
    assert.equal(main(), 'shake-video-element');
  });
});
