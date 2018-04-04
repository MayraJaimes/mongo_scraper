$(".save-article").on("click", function (event) {
  event.preventDefault();
  var information = {id: $(this).data("id")}; 

  $.ajax("/api/saved", {
    type: "PUT",
    data: information
  }).then(
    function () {
      window.location.href = "/";
    }
  );
});

$(".unsave-article").on("click", function (event) {
  event.preventDefault();
  var information = {id: $(this).data("id")}; 

  $.ajax("/api/unsaved", {
    type: "PUT",
    data: information
  }).then(
    function () {
      window.location.href = "/saved";
    }
  );
});

$(".modal-button").on("click", function (event) {
  event.preventDefault();

  $("#comment-modal").css("display", "block");
  $("#existingComments").html('');

  var id = $(this).data("id");
  $.ajax("/article/" + id, {
    type: "GET",
  }).then(function(data) {

    $("#comment-modal").attr("data-id", data._id);
    $(".article-title").html(`${data.title}`);

    if (data.note) {
      $.each(data.note, function(i, item) {
        $("#existingComments").append(
          `<div> ${item.name}</div> 
          <div class="comment"> ${item.body} </div> <hr>`);  
        })
    } else {
      $("#existingComments").html(
        "<p>There are no comments for this article yet.</p>");
    }
  });
});

$(".close").on("click", function (event) {
  $("#comment-modal").css("display", "none");
})

var modal = document.getElementById('comment-modal');
window.onclick = function(event) {
  if (event.target == modal) {
    $("#comment-modal").css("display", "none");
  }
}

$("#comment-modal").on("submit", function (event) {
  event.preventDefault();
  var id = $(this).data("id");
  var newNote = {
    body: $("#body").val().trim(),
    name: $("#name").val().trim()
  };

  $.ajax("/article/add/" + id, {
    type: "POST",
    data: newNote
  })
  .then(function (article) {  
      $("#comment-modal").css("display", "none");
      $("#body").val("");
      $("#name").val("");
      $("#existingComments").html("");
    });
});