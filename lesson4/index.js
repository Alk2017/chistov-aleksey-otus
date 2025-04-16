const fs = require('fs');
const { Transform } = require("stream");

;(async () => {
  const time = new Date().toLocaleTimeString();
  const readStream = fs.createReadStream(__dirname + '/data/input', { encoding: 'utf8' })
  const writeStream = fs.createWriteStream(__dirname + '/data/output-' + time, { encoding: 'utf8' });

const filterAndSplitTransform = new Transform({
  transform(chunk, encoding, callback) {
    const words = chunk.toString()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/);           
    callback(null, words.join('\n'));
  }
});

  class IndexedCollector extends Transform {
    constructor() {
      super()
      this.indexedDict = {}
    }

    _transform(chunk, encoding, callback) {
      chunk.toString().split('\n').forEach(line => {
        if (line in this.indexedDict) {
          this.indexedDict[line] += 1;
        } else {
          this.indexedDict[line] = 1;
        }
      })
      callback();
    }

    _flush(callback) {
      delete this.indexedDict[""]
      const sortedWords = Object.keys(this.indexedDict).sort()
      const res = sortedWords.map(word => {
        return this.indexedDict[word]
      })
      this.push(JSON.stringify(res));
      callback();
    }
  }

  const indexedCollector = new IndexedCollector();

  readStream
      .pipe(filterAndSplitTransform)
      .pipe(indexedCollector)
      .pipe(writeStream);
})()

