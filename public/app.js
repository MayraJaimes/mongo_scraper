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

$(".comment-article").on("click", function (event) {
  event.preventDefault();
  var information = {id: $(this).data("id")}; 

  $.ajax("/article/comments", {
    type: "GET",
    data: information
  }).then(
    function () {
      console.log("got article to comment");
    })
  });

$("#comments").on("submit", function (event) {
  event.preventDefault();

  var newNote = {
    id: $(this).data("id"),
    body: $("#body").val().trim(),
    name: $("#name").val().trim()
  };

  $("#comment").val('');   
  $(".close-item").html("");
  $('#comments').css('display', 'none');
  $('#comments').removeClass('block');
  $('#comments').addClass('none'); 

  $.ajax("/api/unsave/comments", {
    type: "PUT",
    data: newNote
  }).then(
    function (article) {  
      console.log("added comment");

      // console.log("first", article);
      // window.location.href = "/";
    }
  );
});



$('.comment-article').on('click', function () {
  if ($('#comments').hasClass('none')) {
      $(".close-item").html("<i class='fas fa-times'></i>");
      $('#comments').css('display', 'block');
      $('#comments').removeClass('none');
      $('#comments').addClass('block');
  } else {
      $(".close-item").html("");
      $('#comments').css('display', 'none');
      $('#comments').removeClass('block');
      $('#comments').addClass('none');
  }
});

$('.close-item').on('click', function () {
    $(".close-item").html("");
    $('#comments').css('display', 'none');
    $('#comments').removeClass('block');
    $('#comments').addClass('none');
});
