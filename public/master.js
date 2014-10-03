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

	$(document).on("click", "#show-more-info", function showMoreInfo() {
		$(this).hide();
		$('#repo-manipulation').show('normal');
	});

	$(document).on("click", "#gem-vendor-filter a", function toggleVendor(e) {
		e.preventDefault();
		e.stopPropagation();

		var $this = $(this);
		$("#gem-vendor-filter li").removeClass('active');
		$this.parent('li').addClass('active');
		$(".gemlist").trigger('filter');
	});

	$(document).on("keyup", "#gem-search", function toggleSearch() {
		$(".gemlist").trigger('filter');
	});

	$(document).on("filter", ".gemlist", function filterGemList() {
		var vendor = $("#gem-vendor-filter li.active a").attr('data-vendor');
		var search = $("#gem-search").val().toLowerCase();

		if(typeof(Storage) !== "undefined") {
			localStorage.gem_filter_vendor = vendor;
			localStorage.gem_search_string = search;
		}

		var selector = '';
		if (vendor!='all') {
			selector += '[data-vendor='+vendor+']';
		}
		if (search!='') {
			selector += "[data-name*='"+search+"']";
		}
		$('.js-gem-version'+selector).fadeIn('fast');
		if (selector!='') {
			$('.js-gem-version').not(selector).fadeOut('fast');
		}
	});

	if(typeof(Storage) !== "undefined") {
		$("#gem-search").val(localStorage.gem_search_string);
		var vendor = localStorage.gem_filter_vendor || 'all';
		$("#gem-vendor-filter a[data-vendor="+vendor+"]").click();
	}
});
