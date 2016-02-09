$(document).ready(function(){
  $('.first-column div a .circle:first').css('margin-top', '0px');
  $('.second-column div a .circle:first').css('margin-top', '0px');
  $('.third-column div a .circle:first').css('margin-top', '0px');


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
  function firstColumnScroll() {
    //to count clicks to not scroll past last circle
    var myCounter = 0;

    //hide up arrow until down arrow is clicked
    $('.glyphicon-chevron-up').css('opacity','0');
    
    //check to see if there are hidden circles
    var circleCountCheck = $('.circle-container-first-column .circle').length;
    if (circleCountCheck <= 3) {
      var styles = {
        'opacity': '0',
        'cursor': 'initial'
      };
      $('.glyphicon-chevron-down:first').css(styles);
      $('.glyphicon-chevron-up:first').css(styles);
    } else {
      $('.glyphicon-chevron-up:first').click(function(){
        var iScroll = $('.circle-container-first-column').scrollTop();
        var grabCircles = $('.circle-container-first-column .circle');
        var totalCircles = grabCircles.length;
        var circleHeight = $('.circle').height();
        $('.glyphicon-chevron-down:first').css('opacity','1');
        if (circleHeight == 100) {
          if (myCounter > 0) {
            iScroll -= 150;
            myCounter -= 1;
            $('.circle-container-first-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        }
        else if (circleHeight == 125) {
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
        var iScroll = $('.circle-container-first-column').scrollTop();
        var grabCircles = $('.circle-container-first-column .circle');
        var totalCircles = grabCircles.length;
        var circleHeight = $('.circle').height();
        $('.glyphicon-chevron-up:first').css('opacity','1');
        if (circleHeight == 100) {
          if ((iScroll >= 0) && (myCounter < (totalCircles - 3))) {
            iScroll += 150;
            myCounter += 1;
            $('.circle-container-first-column').animate({
              scrollTop: iScroll
            }, 600); 
          }
        }
        else if (circleHeight == 125) {
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
    }
  }
//end firstColumn Scroll

//second column scroll functionality 
  function secondColumnScroll() {
    //to count clicks to not scroll past last circle
    var myCounter = 0;

    //hide up arrow until down arrow is clicked
    $('.glyphicon-chevron-up').css('opacity','0');
    
    //check to see if there are hidden circles
    var circleCountCheck = $('.circle-container-second-column .circle').length;
    if (circleCountCheck <= 2) {
      var styles = {
        'opacity': '0',
        'cursor': 'initial'
      };
      $('.glyphicon-chevron-down:eq(1)').css(styles);
      $('.glyphicon-chevron-up:eq(1)').css(styles);
    } else {
      $('.glyphicon-chevron-up:eq(1)').click(function(){
        var iScroll = $('.circle-container-second-column').scrollTop();
        var grabCircles = $('.circle-container-second-column .circle');
        var totalCircles = grabCircles.length;
        var circleHeight = $('.circle').height();
        $('.glyphicon-chevron-down:eq(1)').css('opacity','1');
        if (circleHeight == 100) {
          if (myCounter > 0) {
            iScroll -= 150;
            myCounter -= 1;
            $('.circle-container-second-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        }
        else if (circleHeight == 125) {
          if (myCounter > 0) {
            iScroll -= 175;
            myCounter -= 1;
            $('.circle-container-second-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        } else if (circleHeight == 150) {
          if (myCounter > 0) {
            iScroll -= 200;
            myCounter -= 1;
            $('.circle-container-second-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        } 
        if (myCounter == 0) {
          $('.glyphicon-chevron-up:eq(1)').css('opacity','0');
        }
      });


      $('.glyphicon-chevron-down:eq(1)').click(function(){
        var iScroll = $('.circle-container-second-column').scrollTop();
        var grabCircles = $('.circle-container-second-column .circle');
        var totalCircles = grabCircles.length;
        var circleHeight = $('.circle').height();
        $('.glyphicon-chevron-up:eq(1)').css('opacity','1');
        if (circleHeight == 100) {
          if ((iScroll >= 0) && (myCounter < (totalCircles - 2))) {
            iScroll += 150;
            myCounter += 1;
            $('.circle-container-second-column').animate({
              scrollTop: iScroll
            }, 600); 
          }
        }
        else if (circleHeight == 125) {
          if ((iScroll >= 0) && (myCounter < (totalCircles))) {
            iScroll += 175;
            myCounter += 1;
            $('.circle-container-second-column').animate({
              scrollTop: iScroll
            }, 600); 
          }
        } else if (circleHeight == 150) {
          if ((iScroll >= 0) && (myCounter < (totalCircles))) {
            iScroll += 200;
            myCounter +=1;
            $('.circle-container-second-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        }
        if ((myCounter + 2) == totalCircles) {
          $('.stages .glyphicon-chevron-down:eq(1)').css('opacity','0');
        }
      });
    }
  }
//end secondColumnScroll()

//third column scroll functionality 
  function thirdColumnScroll() {
    //to count clicks to not scroll past last circle
    var myCounter = 0;

    //hide up arrow until down arrow is clicked
    $('.glyphicon-chevron-up').css('opacity','0');
    
    //check to see if there are hidden circles
    var circleCountCheck = $('.circle-container-third-column .circle').length;
    if (circleCountCheck <= 1) {
      var styles = {
        'opacity': '0',
        'cursor': 'initial'
      };
      $('.glyphicon-chevron-down:eq(2)').css(styles);
      $('.glyphicon-chevron-up:eq(2)').css(styles);
    } else {
      $('.glyphicon-chevron-up:eq(2)').click(function(){
        var iScroll = $('.circle-container-third-column').scrollTop();
        var grabCircles = $('.circle-container-third-column .circle');
        var totalCircles = grabCircles.length;
        var circleHeight = $('.circle').height();
        $('.glyphicon-chevron-down:eq(2)').css('opacity','1');
        if (circleHeight == 100) {
          if (myCounter > 0) {
            iScroll -= 150;
            myCounter -= 1;
            $('.circle-container-third-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        }
        else if (circleHeight == 125) {
          if (myCounter > 0) {
            iScroll -= 175;
            myCounter -= 1;
            $('.circle-container-third-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        } else if (circleHeight == 150) {
          if (myCounter > 0) {
            iScroll -= 200;
            myCounter -= 1;
            $('.circle-container-third-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        } 
        if (myCounter == 0) {
          $('.glyphicon-chevron-up:eq(2)').css('opacity','0');
        }
      });


      $('.glyphicon-chevron-down:eq(2)').click(function(){
        var iScroll = $('.circle-container-third-column').scrollTop();
        var grabCircles = $('.circle-container-third-column .circle');
        var totalCircles = grabCircles.length;
        var circleHeight = $('.circle').height();
        $('.glyphicon-chevron-up:eq(2)').css('opacity','1');
        if (circleHeight == 100) {
          if ((iScroll >= 0) && (myCounter < (totalCircles - 1))) {
            iScroll += 150;
            myCounter += 1;
            $('.circle-container-third-column').animate({
              scrollTop: iScroll
            }, 600); 
          }
        }
        else if (circleHeight == 125) {
          if ((iScroll >= 0) && (myCounter < (totalCircles))) {
            iScroll += 175;
            myCounter += 1;
            $('.circle-container-third-column').animate({
              scrollTop: iScroll
            }, 600); 
          }
        } else if (circleHeight == 150) {
          if ((iScroll >= 0) && (myCounter < (totalCircles))) {
            iScroll += 200;
            myCounter +=1;
            $('.circle-container-third-column').animate({
              scrollTop: iScroll
            }, 600);
          }
        }
        if ((myCounter + 1) == totalCircles) {
          $('.stages .glyphicon-chevron-down:eq(2)').css('opacity','0');
        }
      });
    }
  }
//end thirdColumnScroll()

firstColumnScroll();
secondColumnScroll();
thirdColumnScroll();
});