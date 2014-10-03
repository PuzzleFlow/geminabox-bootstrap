$(document).ready(function documentInitialize() {
	var files;

	$(document).on("change", "input[type='file']", function getFile() {
		files = event.target.files;
	});

	$(document).on("click", "form#upload input[type='submit']", function ajaxUploadGem(e) {
		e.stopPropagation();
		e.preventDefault();

		var data = new FormData();
		$.each(files, function prepareFilesForUpload(key, value) {
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
				if (newHTML.substr(0, 3) == "200") {
					setTimeout(function reloadPage() {
						document.location.href = "/..";
					}, 3000);
				} else {
					$(".page-header").after("<div class='alert alert-info'>" + newHTML + "</div>");
				}
			}
		});

		return false;
	});

	$(document).on("click", "#gem-vendor-filter a", function toggleVendor() {
		var $this = $(this);
		$("#gem-vendor-filter li").removeClass('active');
		$this.parent('li').addClass('active');
		$(".gemlist").trigger('filter');
	});

	$(document).on("keydown", "#gem-search", function toggleSearch() {
		$(".gemlist").trigger('filter');
	});

	$(document).on("filter", ".gemlist", function filterGemList() {
		var vendor = $("#gem-vendor-filter li.active a").attr('data-vendor');
		var search = $("#gem-search").val().toLowerCase();

		var selector = '';
		if (vendor!='all') {
			selector += '[data-vendor='+vendor+']'
		}
		if (search!='') {
			selector += '[data-name~='+search+']'
		}
		if (selector!='') {
			$('.js-gem-version').hide();
		}
		$('.js-gem-version'+selector).show();
	});
});
