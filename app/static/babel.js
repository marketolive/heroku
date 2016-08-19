$(document).ready(function(){
  $('.logo-nav-container').hover(function(){
  $('.logo-nav-container').toggle();
  });
  $('.help-nav-container').hover(function(){
  $('.help-nav-container').toggle();
  });
  var dlpath = "/static/babel-model.json"
  var lang = window.location.pathname.split('/')[1]
  //var category = window.location.pathname.split('/')[2]
  $.getJSON(dlpath)
    .done(function(data){
      //console.log(data)
      
      var babelID, babelType, element

      $('[babel-id]').each(function(){
        element = $(this)
        babelID = element.attr('babel-id')
        babelType = element.attr('babel-type')

        switch(babelType){
          case 'text':
          element.html(data[babelType][babelID][lang])
            break
          case 'link':
          element.attr('href', data[babelType][babelID][lang])
            break
          default:
            console.log("no type")
        }
      });

    })
    .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });
});