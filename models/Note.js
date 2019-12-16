var mongoose = require("mongoose");

// we are using the mongoose method to create a schema
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    _headlineId: {
        type: Schema.Types.ObjectId,
        ref: "Headline"
    },
    date: String,
    noteText: String
});

// here we create the note model and export it out  
// for use, with the rest of our program
var Note = mongoose.model("Note", noteSchema);

module.exports = Note;