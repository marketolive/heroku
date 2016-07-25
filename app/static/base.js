/** $(document).ready(function(){
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
}); **/

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
      var list, dropdown, dropdownText, links, link, json, title

      $('[babelnav]').each(function(){
        list = $(this)
        dropdown = list.find('a.dropdown-toggle')
        title = list.attr('babelnav')
        json = data.navigation[title]
        dropdownText = json.title[lang]
        dropdown.html(dropdownText)

        links = list.find('ul').find('li').find('a')

        for (var i = 0; i < links.length; i++){
            json = data.navigation[title]
            try {
              links[i].innerHTML=json.links[lang][i]
            }
            catch(err){
              console.log(err)
            }
        }
      });
    })
    .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });
});
