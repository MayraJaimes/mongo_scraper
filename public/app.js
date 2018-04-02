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
