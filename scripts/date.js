// Date Script  
// -----------

var makeDate = function() {
    var d = new Date();
    var formattedDate = "";

    formattedDate += (d.getMonth() + 1) + "_";

    formattedDate += d.getDate() + "_";

    formattedDate +=d.getFullYear();

    return formattedDate;
};
// here we have made a variable that creates the date
// then we are exporting it
module.exports = makeDate;