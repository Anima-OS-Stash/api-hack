$(function() {

	var introMessage = $('#begin');
	var contentDisplay = $('.results').find('#display');
	var languageInput = $('#inputLanguage');
	var locationInput = $('#inputLocation');
	var loading = $('#loading');
	var template = $('.template').find('.well');
	var resultCount = $('.results').find('h2');

	var languageInputVal;
	var locationInputVal;

	var ajaxSetup = function() {
		return {
			beforeSend: function() {
				loading.removeClass('hidden');
			},
			complete: function() {
				loading.addClass('hidden');
			}
		};
	};

	var ajaxOptions = function(request) {
		return {
			url: "https://api.github.com/search/users",
			data: request,
			dataType: 'jsonp',
			type: 'GET'
		};
	};

	var getRequest = function() {
		var q = "location:" + locationInputVal;

		if (languageInput.val()) {
			q += " language:" + languageInputVal;
		}

		return {
			q: q,
			sort: "repositories",
			order: "desc"
		};
	};

	var setContent = function(content) {
		if (jQuery.isEmptyObject(content)) {
			contentDisplay.append('<h1>No results</h1>');
		} else {
			resultCount.text(content.length + ' matches found.');
			$.each(content, function(index, item) {
				var result = template.clone();

				result.find('img').attr('src', item.avatar_url);
				result.find('#username').attr('href', item.html_url).text(item.login);

				contentDisplay.append(result);
			});
		}
	};

	var reset = function() {
		introMessage.hide();
		contentDisplay.empty();
		locationInput.val('');
		languageInput.val('');
		resultCount.empty();
		locationInput.focus();
	};

	var search = function(callback) {
		$.ajax(ajaxOptions(getRequest()))
			.done(function(response) {
				callback(response.data.items);
			})
			.fail(function() {
				callback({});
			});
	};

	$.ajaxSetup(ajaxSetup());

	$('#search').submit(function(e) {
		e.preventDefault();

		locationInputVal = locationInput.val();
		languageInputVal = languageInput.val();

		reset();
		search(setContent);
	});

});