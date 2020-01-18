// Server routes 
// -------------

// this will bring in the scrape 
// function from our scripts directory
var Scrape = require("../scripts/scrape");

// this will bring headlines
// and notes from the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
    // this route renders the homepage
router.get("/", function(req, res) {
    res.render("home");
});
    // this route renders the saved handlebars page
router.get("/saved", function(req, res) {
    res.render("saved");
});

// we are creating an API route
// to fetch all of the articles
router.get("/api/fetch", function(req, res) {
    headlinesController.fetch(function(err, docs) {
        if (!docs || docs.insertedCount === 0) {
            res.json({
                message: "No new articles today. Check back tomorrow."
            });
        }
        else {
            res.json({
                message: "Added" + docs.insertedCount + "new articles"
            });
        }
    });
});
router.get("/api/headlines", function(req, res) {
    var query = {};
    if (req.query.saved) {
        query = req.query;
    }

    headlinesController.get(query, function(data){
        res.json(data);
    });
});
router.delete("/api/headlines/:id", function(req,res){
    var query = {};
    query._id = req.params.id;
    headlinesController.delete(query, function(err, data){
        res.json(data);
    });
});
// this will update the headlines
router.patch("/api/headlines", function(req, res) {
    headlinesController.update(req.body, function(err, data){
        res.json(data);
    });
});
// this will get all the notes and display it to the user
router.get("/api/notes/:headline_id?", function(req, res){
    var query = {};
    if (req.params.headline_id) {
        query._id = req.params.headline_id;
    }
    notesController.get(query, function(err, data){
        res.json(data);
    });
});
router.delete("/api/notes/:id", function(req, res){
    var query = {};
    query._id = req.params.id;
    notesController.delete(query, function(err, data){
        res.json(data);
    });
});
// this will post new notes to our articles
router.post("/api/notes", function(req, res){
    notesController.save(req.body, function(data){
        res.json(data);
    });
});
}