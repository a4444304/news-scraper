// Controller for our notes 
// ------------------------

// first we bring in our note model
// and our makeDate function, then we will 
// do a get function that will grab all 
// of the notes associated with the articles

var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    get: function(data, cb) {
        Note.find({
            _headlineId: data._id,
        }, cb);
    },
    save: function(data, cb) {
        var newNote = {
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
// this will take the note and create a new one
    Note.create(newNote, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(doc);
            cb(doc);
        }
    });
    },
// this delete function will remove 
// notes associated with the articles
delete: function(data, cb) {
    Note.remove({
        _id: data._id
    }, cb); 
}
};

