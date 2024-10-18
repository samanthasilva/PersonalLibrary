$(document).ready(function () {
  let items = [];
  let itemsRaw = [];

  $.getJSON("/api/books", function (data) {
    itemsRaw = data;
    $.each(data, function (i, val) {
      items.push(
        '<li class="bookItem" id="' +
          i +
          '">' +
          val.title +
          " - " +
          val.commentcount +
          " comments</li>"
      );
      return i !== 14;
    });
    if (items.length >= 15) {
      items.push("<p>...and " + (data.length - 15) + " more!</p>");
    }
    $("<ul/>", {
      class: "listWrapper",
      html: items.join(""),
    }).appendTo("#display");
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error("Error fetching books:", textStatus, errorThrown);
    $("#display").html("<p>Error retrieving books. Please try again.</p>");
  });

  let comments = [];
  $("#display").on("click", "li.bookItem", function () {
    $("#detailTitle").html(
      "<b>" +
        itemsRaw[this.id].title +
        "</b> (id: " +
        itemsRaw[this.id]._id +
        ")"
    );
    $.getJSON("/api/books/" + itemsRaw[this.id]._id, function (data) {
      comments = [];
      $.each(data.comments, function (i, val) {
        comments.push("<li>" + val + "</li>");
      });
      comments.push(
        '<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>'
      );
      comments.push(
        '<br><button class="btn btn-info addComment" id="' +
          data._id +
          '">Add Comment</button>'
      );
      comments.push(
        '<button class="btn btn-danger deleteBook" id="' +
          data._id +
          '">Delete Book</button>'
      );
      $("#detailComments").html(comments.join(""));
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching book details:", textStatus, errorThrown);
      $("#detailComments").html("<p>Error retrieving book details. Please try again.</p>");
    });
  });

  $("#bookDetail").on("click", "button.deleteBook", function () {
    $.ajax({
      url: "/api/books/" + this.id,
      type: "delete",
      success: function (data) {
        $("#detailComments").html('<p style="color: red;">' + data + "<p><p>Refresh the page</p>");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error deleting book:", textStatus, errorThrown);
        $("#detailComments").html("<p>Error deleting the book. Please try again.</p>");
      }
    });
  });

  $("#bookDetail").on("click", "button.addComment", function () {
    let newComment = $("#commentToAdd").val();
    $.ajax({
      url: "/api/books/" + this.id,
      type: "post",
      dataType: "json",
      data: $("#newCommentForm").serialize(),
      success: function (data) {
        comments.unshift(newComment); // adds new comment to top of list
        $("#detailComments").html(comments.join(""));
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error adding comment:", textStatus, errorThrown);
        $("#detailComments").html("<p>Error adding comment. Please try again.</p>");
      }
    });
  });

  $("#newBook").click(function () {
    $.ajax({
      url: "/api/books",
      type: "post",
      dataType: "json",
      data: $("#newBookForm").serialize(),
      success: function (data) {
        // update list or refresh books
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error creating new book:", textStatus, errorThrown);
        // Handle error message
      }
    });
  });

  $("#deleteAllBooks").click(function () {
    $.ajax({
      url: "/api/books",
      type: "delete",
      dataType: "json",
      success: function (data) {
        // update list or refresh books
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error deleting all books:", textStatus, errorThrown);
        // Handle error message
      }
    });
  });
});
