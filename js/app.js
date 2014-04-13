$(function() {

	var begin = $('#begin');
	var display = $('.results #display');

	$('#search').submit(function(e) {
		e.preventDefault();

		begin.hide();
		$('.results #display').empty();

		var url = "https://api.github.com/search/users";
		var language = $('#inputLanguage').val();
		var location = $('#inputLocation').val();
		var q = "location:" + location;

		var request = {
			q: q,
			sort: "repositories",
			order: "desc"
		};

		$.ajaxSetup({
			beforeSend: function() {
				$('#loading').removeClass('hidden');
			},
			complete: function() {
				$('#loading').addClass('hidden');
			}
		});

		var result = $.ajax({
			url: url,
			data: request,
			dataType: 'jsonp',
			type: 'GET'
		})
		.done(function(result) {
			$.each(result.data.items, function(index, item) {
				var temp = $('.template .well').clone();
				temp.find('img').attr('src', item.avatar_url);
				temp.find('#username').attr('href', item.html_url).text(item.login);
				$('.results #display').append(temp).hide().fadeIn(500);
			});
		})
		.fail(function() {
			alert('failed');
		});

	});
});