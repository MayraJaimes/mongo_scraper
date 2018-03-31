










// function displayResults() {
//   $("#articles").empty();
//   $.getJSON("/all", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#articles").append("<div class='data-entry' data-id=" + data[i]._id + "> <a href='" + data[i].link + "'> <h4>" + data[i].title+ "</h4></a>  <button class='btn' class='save-article'> Save </button> </div>");
//     }
//   });
// }

// displayResults();


// $("#scrape-articles").on("click", function() {
//   $.getJSON("/all", function(data) {
//     displayResults(data);
//   });
// });

// $("#save-article").on("click", function() {
//   $.getJSON("/saved", function(data) {
//     displayResults(data);
//   });
// });
