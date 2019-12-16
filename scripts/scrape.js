// Scrape Script  
// -------------

// here we are requiring request and cheerio,
// this will make the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("http://www.nytimes.com", function(err, res, body){

        var $ = cheerio.load(body);

        var articles = [];

        // we are going to select all the theme summaries, 
        // on each theme summary, grab the text and cut off  
        // white space

        $(".theme-summary").each(function(i, element){
            var head = $(this).children(".story-heading").text().trim();
            var sum = $(this).children(".summary").text().trim();

            // if head and sum exist, meaning the scraper was able 
            // to get the text, execute the replace regex method

            if(head && sum){
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;