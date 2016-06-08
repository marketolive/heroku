$(document).ready(function(){
  $('.logo-nav-container').hover(function(){
    $('.logo-nav-container').toggle();
  });
  $('.help-nav-container').hover(function(){
    $('.help-nav-container').toggle();
  });
  var subdomain = window.location.hostname.split('.')[0];
  if (subdomain == "partners"){var dlpath = "/static/deeplinks_partners.json"}
  	else {var dlpath = "/static/deeplinks.json"}
  $.getJSON(dlpath)
	  .done(function(data){
	  	console.log(data)
	  	$('[deeplink]').each(function(){
        	$(this).attr('href', data[window.location.pathname.split('/')[1]][$(this).attr('deeplink')]);
	  	});
	  })
	  .fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	  });
});