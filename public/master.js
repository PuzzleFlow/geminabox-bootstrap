$(document).ready(function documentInitialize() {
  var files;

  $(document).on("change", "input[type='file']", function getFile(){
    files = event.target.files;
  });

  $(document).on("click", "form#upload input[type='submit']", function ajaxUploadGem(e) {
    e.stopPropagation();
    e.preventDefault();

    var data = new FormData();
    $.each(files, function prepareFilesForUpload(key, value){
      data.append("file", value);
    });

    console.log(data);

    $.ajax({
      url: "/upload",
      type: "POST",
      data: data,
      cache: false,
      processData: false,
      contentType: false,

      success: function redirectBackToHomePage(newHTML, textStatus, jqXHR) {
        if(newHTML.substr(0, 3) == "200") {
          setTimeout(function reloadPage() { document.location.href = "/.."; }, 3000);
        } else {
          $(".page-header").after("<div class='alert alert-info'>" + newHTML + "</div>");
        }
      }
    });

    return false;
  });
});
