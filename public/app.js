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
  $("#existingComments").html('');
  var id = $(this).data("id");
  console.log("id on client side", id);
  $.ajax("/article/" + id, {
    type: "GET",
  }).then(function(data) {

    $("#modal").attr("data-id", data._id);
    $(".article-title").html(`${data.title}`);
    $("#modal").css("display", "block");

    if (data.note) {
      console.log("data-noteeeeeee", data.note);
      $.each(data.note, function(i, item) {
        console.log("itemmmmmm", item.body);
        $("#existingComments").append(
        `<div>${item.name}</div> 
        <div> ${item.body} </div>
        <p class="delete-comment">  
        <i class='fas fa-times'></i> </p>`);  
        })
    } else {
      $("#existingComments").html(
      "<p>There are no comments for this article yet.</p>");
    }
  });
});


$("#modal").on("submit", function (event) {
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
      console.log("added comment");
      $("#modal").css("display", "none");
      $("#existingComments").html('');
    });
});


$('.close-item').on('click', function () {
  $("#modal").css("display", "none");
  $("#existingComments").html('');
});


// $('.comment-article').on('click', function () {
//   if ($('#comments').hasClass('none')) {
//       $(".close-item").html("<i class='fas fa-times'></i>");
//       $('#comments').css('display', 'block');
//       $('#comments').removeClass('none');
//       $('#comments').addClass('block');
//   } else {
//       $(".close-item").html("");
//       $('#comments').css('display', 'none');
//       $('#comments').removeClass('block');
//       $('#comments').addClass('none');
//   }
// });






// <div id="comments" role="dialog" data-id="{{this._id}}" style="display:none" class="none">
// <div class="modal-dialog">
//   <div class="modal-content">      
//     <div class="close-item"> </div>
//     <form class="form-comment" data-id="{{this._id}}" name="add-comment">
//         <label for="item_name">
//           <h3>Comments for Article: {{this.title}} </h3>
//           <hr>

//           <h3>Existing Comments </h3>
//         </label>

//         {{#if this.note}}
//           {{#each note}}
//           <li class="article-comments-list">
//               <p> {{this.note.title}}</p>
//               <p> {{this.note.body}} </p>
//               <a>
//                   <p class="delete-comment">  <i class='fas fa-times'></i> </p>
//               </a>
//           </li>
//           {{/each}}

//         {{else}}
//           <p>There are no comments for this article yet.</p>
//         {{/if}}

//         <textarea placeholder="Your Name" class="text-area" required="" id="name" rows="1"></textarea>
//           <hr>
//         <textarea placeholder="New Comment" class="text-area" id="body" rows="2"></textarea>
//           <hr>
//         <button class="btn btn-primary submit-button" type="submit">Submit</button>
//     </form>
//   </div>
// </div>
// </div>



// $.getJSON("/articles/:id", function(data) {
//   for (var i = 0; i < data.note.length; i++) {
//     $("#existingComments").append(`<div>${data[i].note.title}</div> 
//     <div> ${data[i].note.body} </div>
//     <p class="delete-comment">  <i class='fas fa-times'></i> </p>` );
//   }
// });
// }