var retrievedQuote = "";
var retrievedAuthor = "";
var retrievedCategory = "movies";
var translatedQuote = "";
function generateQuote() {
    getQuote();
}
function getQuote() {
    console.log("Getting quote...");
    $.ajax({
        url: "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=" + retrievedCategory,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Accept", "application/json");
            xhrObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhrObj.setRequestHeader("X-Mashape-Authorization", "AwbgEZ1Wqqmshirsyf5x49g4qTj3p1KK0uHjsnwSyoj4AQc1p5");
        },
        type: "POST"
    })
        .done(function (data) {
        var json = JSON.parse(data);
        retrievedQuote = json.quote;
        getYodaSpeak();
    })
        .fail(function (error) {
        console.log(error);
    });
}
function getYodaSpeak() {
    console.log("Getting yoda translation...");
    $.ajax({
        url: 'https://yoda.p.mashape.com/yoda?sentence=' + retrievedQuote,
        type: 'GET',
        datatype: 'json',
        success: function (data) {
            translatedQuote = data;
            updateYodaSpeak();
        },
        error: function (err) {
            alert(err);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", "AwbgEZ1Wqqmshirsyf5x49g4qTj3p1KK0uHjsnwSyoj4AQc1p5"); // Enter here your Mashape key
        }
    });
}
function updateYodaSpeak() {
    $("#final-quote").html(translatedQuote);
}
