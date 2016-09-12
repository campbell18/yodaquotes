//Set up temp variables to be update by the APIs 
var retrievedQuote = "";
var retrievedAuthor = "";
var retrievedCategory = "";
//Object used to update UI
var endQuote;
var gettingQuote;
gettingQuote = false;
//Set up variables for the HTML elements we will use
var getQuoteButton = $("#main-button")[0];
var quoteText = $("#final-quote")[0];
var authorText = $("#final-author")[0];
var drop = $('#dropdown-menu li')[0];
$('#dropdown-menuz li').on('click', function () {
    var tempCategory = $(this).text();
    if (tempCategory == "Movie Quote") {
        retrievedCategory = "movies";
        $("#warn").hide();
    }
    else if (tempCategory == "Person Quote") {
        $("#warn").hide();
        retrievedCategory = "famous";
    }
});
function rotation() {
    $("#yoda-image").rotate({
        angle: 0,
        animateTo: 360,
        callback: rotation,
        easing: function (x, t, b, c, d) {
            if (gettingQuote) {
                return c * (t / d) + b;
            }
        }
    });
}
//Class/object to hold final values and update UI with.
var YodaQuote = (function () {
    function YodaQuote(qquote, aauthor) {
        this.qquote = qquote;
        this.aauthor = aauthor;
        this.quote = qquote;
        this.author = aauthor;
    }
    YodaQuote.prototype.getYodaQuote = function () {
        return quoteText.innerHTML = this.quote, authorText.innerHTML = this.author;
    };
    return YodaQuote;
}());
//Add listener to the "Get Yoda Quote" button
getQuoteButton.addEventListener("click", function () {
    if (!gettingQuote && retrievedCategory != "") {
        gettingQuote = true;
        //Hide error message if it is showing
        $("#warn").hide();
        //Disabled buttons and dropdown
        $("#main-button").removeClass("active");
        $("#main-button").addClass("disabled");
        $("#yoda-drop").removeClass("active");
        $("#yoda-drop").addClass("disabled");
        //Show loading message and spin yoda head
        $("#placeholder").show();
        $("#final-quote").hide();
        $("#final-author").hide();
        rotation();
        //Begin API calls to generate quote
        generateQuote();
    }
    else {
        //If user has not selected type show error message 
        $("#warn").show();
    }
});
//Call the APIs and set loading animations
function generateQuote() {
    getQuote();
}
//AJAX call to get famous quote from specified categories
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
        //Parse the data
        var json = JSON.parse(data);
        retrievedQuote = json.quote;
        retrievedAuthor = json.author;
        //Translate it into yoda speak
        getYodaSpeak();
    })
        .fail(function (error) {
        console.log(error);
    });
}
//AJAX call which POSTS the retrieved famous quote and returns the quote in "Yoda speak"
function getYodaSpeak() {
    console.log("Getting yoda translation...");
    $.ajax({
        url: 'https://yoda.p.mashape.com/yoda?sentence=' + retrievedQuote,
        type: 'GET',
        datatype: 'json',
        success: function (data) {
            //Create new YodaQuote object with final results
            endQuote = new YodaQuote(data, retrievedAuthor);
            //Once the quote has been translated update the UI elements
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
//Update UI elements with data retrieved by API calls. End loading animations.
function updateYodaSpeak() {
    //Re-anable button
    $("#main-button").addClass("active");
    $("#main-button").removeClass("disabled");
    //Re-anable button
    $("#yoda-drop").addClass("active");
    $("#yoda-drop").removeClass("disabled");
    $("#placeholder").hide();
    $("#final-quote").show();
    $("#final-author").show();
    //Update UI elements
    endQuote.getYodaQuote();
    //Reset boolean
    gettingQuote = false;
}
