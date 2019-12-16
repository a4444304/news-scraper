// this will bring in the scrape and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// this will bring in the Headline and Note mongoose models
var Headline = require("../models/Headline");

module.exports = {
// fetch is going to run the scrape function  
// and will grab all of the articles and insert  
// them into the  headline collection in the   
// mongo database
    fetch: function(cb) {
        scrape(function(data) {
            var articles = data;
            for (var i=0; i<articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }

Headline.collection.insertMany(articles, {ordered:false}, function(err, docs){
    cb(err,docs);
        });
        });
    },
    delete: function(query, cb) {
        Headline.remove(query, cb);
    },
    get: function(query, cb) {
        Headline.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            cb(doc);
        });
    },
    // this function will update the articles
    update: function(query, cb) {
        Headline.update({_id: query._id}, {
            $set: query
        }, {}, cb);
    }
}