$(".save-article").on("click", function (event) {
  event.preventDefault();

  var id = $(this).data("id");
  var information = {
    id: id,
  };

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

  var id = $(this).data("id");
  var information = {
    id: id,
  };

  $.ajax("/api/unsave", {
    type: "PUT",
    data: information
  }).then(
    function () {
      window.location.href = "/saved";
    }
  );
});

$(".comment-article").on("click", function (event) {
  var id = $(this).data("id");
  console.log("id", id);

  var information = {
    id: id
  }; 

  event.preventDefault();

  $.ajax("/api/unsave_comments", {
    type: "GET",
    data: information
  }).then(
    function () {
      console.log("add comment");
      
    })
  });

$("#comments").on("submit", function (event) {
  event.preventDefault();

  var id = $(this).data("id");
  console.log(id);
  var comment = $("#comment").val().trim();

  var newComment = {
    id: id,
    comment: comment
  };

  console.log(newComment);

  $("#comment").val('');   
  $(".close-item").html("");
  $('#comments').css('display', 'none');
  $('#comments').removeClass('block');
  $('#comments').addClass('none'); 

  $.ajax("/api/unsave/comments", {
    type: "PUT",
    data: newComment
  }).then(
    function (article) {  
     
      console.log("first", article);
      window.location.href = "/";
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
