$(function() {

	/*--- jQuery DOM element variables ---*/
	var loading = $('#loading');
	var introMessage = $('#begin');
	var template = $('.template').find('.well');
	var contentDisplay = $('.results').find('#display');
	var languageInput = $('#inputLanguage');
	var locationInput = $('#inputLocation');
	var resultAbbr = $('.results').find('h2').find('abbr');
	var resultSpan = $('.results').find('h2').find('span');

	/*--- Used for temporary storage of language and location values ---*/
	var languageInputVal;
	var locationInputVal;

	/**
	 * Contains all AJAX setup information.
	 *
	 * @params void
	 * @return object
	 */
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

	/**
	 * Allows for defining options to be used in AJAX request.
	 *
	 * @params object
	 * @return object
	 */
	var ajaxOptions = function(request) {
		return {
			url: "https://api.github.com/search/users",
			data: request,
			dataType: 'jsonp',
			type: 'GET'
		};
	};

	/**
	 * Defines request to be used in ajaxOptions function.
	 *
	 * @params void
	 * @return object
	 */
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

	/**
	 * Displays feedback about number of matches found.
	 *
	 * @params integer
	 * @return void
	 */
	var setFeedback = function(count) {
		var resultContent = ' found for <em>' + languageInputVal;
		resultContent += '</em> programmers in <em>' + locationInputVal;
		resultContent += '</em>.';

		resultAbbr.text(count + ' matches').hide().fadeIn(500);
		resultSpan.html(resultContent).hide().fadeIn(500);
	};

	/**
	 * Fills in cloned template with user's information.
	 *
	 * @params object
	 * @return object
	 */
	var setUserInformation = function(item) {
		var result = template.clone();

		result.find('img').attr('src', item.avatar_url);
		result.find('#username').attr('href', item.html_url).text(item.login);
		result.find('#profile').attr('href', item.html_url);

		return result;
	};

	/**
	 * Loops through each AJAX response array and appends to content.
	 *
	 * @params array of objects
	 * @return void
	 */
	var setContent = function(content) {
		if (jQuery.isEmptyObject(content)) {
			contentDisplay.append('<h1>No results</h1>');
		} else {
			setFeedback(content.length);
			$.each(content, function(index, item) {
				var result = setUserInformation(item);
				contentDisplay.append(result).hide().fadeIn(500);
			});
		}
	};

	/**
	 * Resets all content and feedback for next query.
	 *
	 * @params function definition
	 * @return void
	 */
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

	/**
	 * Performs initial AJAX call.
	 *
	 * @params function definition
	 * @return void
	 */
	var search = function(callback) {
		$.ajax(ajaxOptions(getRequest()))
			.done(function(response) {
				callback(response.data.items);
			})
			.fail(function() {
				callback({});
			});
	};

	/*--- AJAX setup function ---*/
	$.ajaxSetup(ajaxSetup());

	/*--- Performs initial action on search form submit ---*/
	$('#search').submit(function(e) {
		e.preventDefault();
		reset(function() {
			search(setContent);
		});
	});

});