// global bootbox
$(document).ready(function() {
    // adding event listeners to any dynamically
    // generated "save article" and "scrape new article" buttons
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    // when the page is ready, the initPage function will put  
    // things in motion
    initPage();
    
    function initPage() {
        articleContainer.empty();
        // we are going to empty the article container and 
        // run a AJAX request for any unsaved headlines
        $.get("/api/headlines?saved=true")
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
          "<a class='btn btn-danger delete'>",
          "Delete From Saved",
          "</a>",
          "<a class='btn btn-info notes'>Article Notes</a>",
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
        "<h4>Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would you like to browse available articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
        ].join(""));
    // this will append the data to the page
    articleContainer.append(emptyAlert);
    }
    
    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = []
        }


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

    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "Delete",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article: ",
                currentArticle._id,
                "</h4>",
                "<hr/>",
                "<ul class='List-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class= 'btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);
        });
    }
function handleNoteSave() {
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    if (newNote) {
        noteData = {
            _id: $(this).data("article")._id,
            noteText:newNote
        };
    $.post("/api/notes", noteData).then(function() {
        bootbox.hideAll();
    });
    }
}

function handleNoteDelete() {
    var noteToDelete = $(this).data("_id");
    $.ajax({
        url: "/api/notes" + noteToDelete,
        method: "Delete"
    }).then(function() {
        bootbox.hideAll();
    });
}
