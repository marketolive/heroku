$(document).ready(function(){
  $('.circle div').hover(function(){
    $(this).children('img').toggle();
  });
  $('.circle').hover(function(){
    $(this).children('img').toggle();
  });
  $('.circle p').hover(function(){
    $(this).siblings('div').children('img').toggle();
  });

  //Start scroll functionality 
  var col1Icons = $('.glyphicon-chevron-up');
  $('.glyphicon-chevron-up').click(function(){
    $(".first-column .circle:nth-child(2)").slideUp('fast', function(){
      $(this).fadeOut('fast');
    });
    $(".first-column .circle:nth-child(5)").fadeIn();
  });
});