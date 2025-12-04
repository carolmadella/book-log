const Sequence = require('../models/sequence');

let maxBookId;
let sequenceId = null;

function SequenceGenerator() {

  Sequence.findOne().exec()
  .then((sequence) => {
      sequenceId = sequence._id;
      maxBookId = sequence.maxBookId;
  })
  .catch((err) => {
    return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
  });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  let updateObject = {};
  let nextId;

    // switch statement prepared for future app extension.
  switch (collectionType) {
    case 'books':
      maxBookId++;
      updateObject = { maxBookId: maxBookId };
      nextId = maxBookId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne(
    {_id: sequenceId},
    {$set: updateObject},
    )
  .catch(err => {
     console.log("nextId error = " + err);
        return null
  });

  return nextId;
}

module.exports = new SequenceGenerator();
