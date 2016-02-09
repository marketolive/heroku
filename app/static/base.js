$(document).ready(function(){
  $('.logo-nav-container').hover(function(){
    $('.logo-nav-container').toggle();
  });
  $('.help-nav-container').hover(function(){
    $('.help-nav-container').toggle();
  });
  $.getJSON('/static/deeplinks.json')
	  .done(function(data){
	  	//console.log("Got JSON");
	  	$('[deeplink]').each(function(){
	  		$(this).wrap('<a target="_blank" href="'+data[window.location.pathname.split('/')[1]][$(this).attr('deeplink')]+'"></a>');
	  	});
	  })
	  .fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	  });
});