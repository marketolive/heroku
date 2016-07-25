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
	  	//console.log(data)
	  	
	  	var pageID, div, divID, divText, divLink, h2

	  	pageID = $('html').attr('id')
	  	h2 = $('h2')
	  	
	  	$('title').html(data[category].page_meta[pageID].title[lang])
	  	$('h1').html(data[category].page_meta[pageID].h1[lang])
	  	$('[babel]').each(function(){
	  		div = $(this)
	  		divID = div.context.id
	  		divLink = div.find('a')
	  		divText = div.find('p')

	    	divLink.attr('href', data[category].use_cases[divID].href[lang])
	    	divText.html(data[category].use_cases[divID].p[lang])
	  	});

	  	for(var i = 0; i < h2.length; i++){
	  		h2[i].innerHTML=data[category].page_meta[pageID].h2[lang][i] 
	  	}


	  })
	  .fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
});