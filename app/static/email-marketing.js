$(document).ready(function(){
	$('.logo-nav-container').hover(function(){
	$('.logo-nav-container').toggle();
	});
	$('.help-nav-container').hover(function(){
	$('.help-nav-container').toggle();
	});
	var dlpath = "/static/babel-model.json"
	var lang = window.location.pathname.split('/')[1]
	var category = window.location.pathname.split('/')[2]
	$.getJSON(dlpath)
	  .done(function(data){
	  	console.log(data)
	  	$('[babel]').each(function(){
	  		var div = $(this)
	  		var divID = div.context.id
	  		var divLink = div.find('a')
	  		var divText = div.find('p')
	    	
	    	divLink.attr('href', data[category].use_cases[divID].href[lang])
	    	divText.html(data[category].use_cases[divID].p[lang])
	  	});
	  	var pageID = $('html').id
	  	console.log(pageID)
	  })
	  .fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
});