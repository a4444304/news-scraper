// global bootbox
$(document).ready(function() {
// adding event listeners to any dynamically
// generated "save article" and "scrape new article" buttons
var articleContainer = $(".article-container");
$(document).on("click", ".btn.save", handleArticleSave);
$(document).on("click", ".scrape-new", handleArticleScrape);
// when the page is ready, the initPage function will put  
// things in motion
initPage();

function initPage() {
    articleContainer.empty();
    // we are going to empty the article container and 
    // run a AJAX request for any unsaved headlines
    $.get("/api/headlines?saved=false")
    .then(function(data) {
        // if we have headlines, render them to the page
        if (data && data.length) {
            renderArticles(data);
        }
        else {
        // otherwise display a message saying we have no  
        // articles
            renderEmpty();
        }
    });
}
function renderArticles(articles) {
    var articlePanels = [];
    // we pass each article JSON object to the 
    // createPanel function which returns a 
    // bootstrap panel with our article data inside
    for(var i = 0; i< articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
}
function createPanel(article){
    var panel =
    $(["<div class='panel panel-default'>",
      "<div class='panel-heading'>",
      "<h3>",
      article.headline,
      "<a class='btn btn-success save'>",
      "Save Article",
      "</a>",
      "</h3>",
      "</div>",
      "<div class='panel-body'>",
      article.summary,
      "</div>",
      "</div>"
    ].join(""));
panel.data("_id", article._id);
// we return the jQuery element
return panel;
}

function renderEmpty() {
    var emptyAlert =
    $(["<div class='alert alert-warning text-center'>",
    "<h4>Looks like we don't have any new articles.</h4>",
    "</div>",
    "<div class='panel panel-default'>",
    "<div class='panel-heading text-center'>",
    "<h3>What would you like to do?</h3>",
    "</div>",
    "<div class='panel-body text-center'>",
    "<h4><a class='scrape-new'>Try scraping new articles</a></h4>",
    "<h4><a href='/saved'>Go to saved articles</a></h4>",
    "</div>",
    "</div>"
    ].join(""));
// this will append the data to the page
articleContainer.append(emptyAlert);
}

function handleArticleSave() {
    var articleToSave =  $(this).parents(".panel").data();
    articleToSave.saved = true;
    $.ajax({
        method: "PATCH",
        url: "/api/headlines",
        data: articleToSave
    })
    .then(function(data) {
        if (data.ok) {
            initPage();
        }
    });
}

function handleArticleScrape() {
    $.get("/api/fetch")
    .then(function(data) {
        initPage();
        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
}
});