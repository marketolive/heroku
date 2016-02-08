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

  //first column scroll functionality 
  var iScroll = $('.circle-container-first-column').scrollTop();
  var myCounter = 0;
  var grabCircles = $('.circle-container-first-column .circle');
  var totalCircles = grabCircles.length;
  var circleHeight = $('.circle').height();
  $('.glyphicon-chevron-up').css('opacity','0');

  $('.glyphicon-chevron-up:first').click(function(){
    $('.glyphicon-chevron-down:first').css('opacity','1');
    if (circleHeight == 125) {
      if (myCounter > 0) {
        iScroll -= 175;
        myCounter -= 1;
        $('.circle-container-first-column').animate({
          scrollTop: iScroll
        }, 600);
      }
    } else if (circleHeight == 150) {
      if (myCounter > 0) {
        iScroll -= 200;
        myCounter -= 1;
        $('.circle-container-first-column').animate({
          scrollTop: iScroll
        }, 600);
      }
    } 
    if (myCounter == 0) {
      $('.glyphicon-chevron-up:first').css('opacity','0');
    }
  });


  $('.glyphicon-chevron-down:first').click(function(){
    $('.glyphicon-chevron-up:first').css('opacity','1');
    if (circleHeight == 125) {
      if ((iScroll >= 0) && (myCounter < (totalCircles - 3))) {
        iScroll += 175;
        myCounter += 1;
        $('.circle-container-first-column').animate({
          scrollTop: iScroll
        }, 600); 
      }
    } else if (circleHeight == 150) {
      if ((iScroll >= 0) && (myCounter < (totalCircles - 3))) {
        iScroll += 200;
        myCounter +=1;
        $('.circle-container-first-column').animate({
          scrollTop: iScroll
        }, 600);
      }
    }
    if ((myCounter + 3) == totalCircles) {
      $('.glyphicon-chevron-down:first').css('opacity','0');
    }
  });

});