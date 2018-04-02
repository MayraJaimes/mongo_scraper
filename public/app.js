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