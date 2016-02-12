$(document).ready(function(){
  $('.circle-container').children().each(function() {
    $(this).addClass('item'+($(this).index() + 1));
  });
});