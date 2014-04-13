$(function() {
	$('#search').submit(function(e) {
		e.preventDefault();
		var url = "https://api.github.com/search/users";

		var request = {
			q: "language:php location:denver",
			sort: "repositories",
			order: "desc"
		};

		var result = $.ajax({
			url: url,
			data: request,
			dataType: 'jsonp',
			type: 'GET'
		})
		.done(function() {
			alert(JSON.stringify(result));
		})
		.fail(function() {
			alert('failed');
		});

	});
});