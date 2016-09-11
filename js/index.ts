//Set up temp variables to be update by the APIs 
var retrievedQuote = ""
var retrievedAuthor = ""
var retrievedCategory = "movies"

//Object used to update UI
var endQuote: YodaQuote;
var gettingQuote: boolean;
gettingQuote = false;

//Set up variables for the HTML elements we will use
var getQuoteButton = $("#main-button")[0]
var quoteText = $("#final-quote")[0]
var authorText = $("#final-author")[0]

//Class/object to hold final values and update UI with.
class YodaQuote {
    quote: string;
    author: string;

    constructor(public qquote, public aauthor) {
        this.quote = qquote;
        this.author = aauthor;
    }    
    getYodaQuote() {
        return quoteText.innerHTML = this.quote, authorText.innerHTML = this.author;
    }
}

//Add listener to the "Get Yoda Quote" button
getQuoteButton.addEventListener("click", function () {
    if (!gettingQuote){
      gettingQuote = true;     
      $("#main-button").removeClass("active");
      $("#main-button").addClass("disabled");
      generateQuote();
    }    
});

//Call the APIs and set loading animations
function generateQuote(): void {
  
  getQuote()
}

//AJAX call to get famous quote from specified categories
function getQuote(): void {
  console.log("Getting quote...")
  $.ajax({
    url: "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=" + retrievedCategory,
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Accept", "application/json");
      xhrObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
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
      getYodaSpeak()

    })
    .fail(function (error) {
      console.log(error);
    });

}

//AJAX call which POSTS the retrieved famous quote and returns the quote in "Yoda speak"
function getYodaSpeak(): void {
  console.log("Getting yoda translation...")
  $.ajax({
    url: 'https://yoda.p.mashape.com/yoda?sentence=' + retrievedQuote,
    type: 'GET',
    datatype: 'json',
    success: function (data) {
      
      //Create new YodaQuote object with final results
      endQuote = new YodaQuote(data, retrievedAuthor)

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
function updateYodaSpeak(): void {

  //Re-anable button
  $("#main-button").addClass("active");
  $("#main-button").removeClass("disabled");

  //Update UI elements
  endQuote.getYodaQuote();

  //Reset boolean
  gettingQuote = false;
}