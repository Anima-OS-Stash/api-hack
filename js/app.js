$(function() {

	var loading = $('#loading');
	var introMessage = $('#begin');
	var template = $('.template').find('.well');
	var contentDisplay = $('.results').find('#display');
	var languageInput = $('#inputLanguage');
	var locationInput = $('#inputLocation');
	var resultAbbr = $('.results').find('h2').find('abbr');
	var resultSpan = $('.results').find('h2').find('span');

	var languageInputVal;
	var locationInputVal;

	var ajaxSetup = function() {
		return {
			beforeSend: function() {
				loading.fadeOut(200, function() {
					$(this).removeClass('hidden');
				});
			},
			complete: function() {
				loading.addClass('hidden').fadeIn(200);
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

		if (languageInputVal) {
			q += " language:" + languageInputVal;
		}

		return {
			q: q,
			sort: "repositories",
			order: "desc"
		};
	};

	var setFeedback = function(count) {
		var resultContent = ' found for <em>' + languageInputVal;
		resultContent += '</em> programmers in <em>' + locationInputVal;
		resultContent += '</em>.';

		resultAbbr.text(count + ' matches').hide().fadeIn(500);
		resultSpan.html(resultContent).hide().fadeIn(500);
	};

	var setContent = function(content) {
		if (jQuery.isEmptyObject(content)) {
			contentDisplay.append('<h1>No results</h1>');
		} else {
			setFeedback(content.length);
			$.each(content, function(index, item) {
				var result = template.clone();

				result.find('img').attr('src', item.avatar_url);
				result.find('#username').attr('href', item.html_url).text(item.login);
				result.find('#profile').attr('href', item.html_url);

				contentDisplay.append(result).hide().fadeIn(500);
			});
		}
	};

	var reset = function(callback) {
		locationInputVal = locationInput.val();
		languageInputVal = languageInput.val();

		introMessage.fadeOut(
			200,
			function(){
				contentDisplay.fadeOut(
					200,
					function() {
						$(this).empty().show();
						locationInput.val('');
						languageInput.val('');
						resultAbbr.fadeOut(
							200,
							function() {
								$(this).empty().show();
							});
						resultSpan.fadeOut(
							200,
							function() {
								$(this).empty().show();
								locationInput.focus();
								callback();
							});
					});
			});
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
		reset(function() {
			search(setContent);
		});
	});

});