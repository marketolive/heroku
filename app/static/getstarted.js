$(document).ready(function(){
	console.log("working?");
	if($(window).width() > 999) {
	    $('#fullpage').fullpage({
        	anchors:['B2B-Marketing', 'DriveMoreAwareness', 'EngageYourCustomer', 'AlignWithSales', 'MeasureYourSuccess']
    	});
	    console.log("fullpage iniatilizing?XX");

	    $('.arrow-container-down').click(function(){
	      $.fn.fullpage.moveSectionDown();
	      //console.log("did it move down?");
	    });

	    $('.arrow-container-up').click(function(){
	      $.fn.fullpage.moveSectionUp();
	      //console.log("did it move up?");
	    });
	}

});

$(window).resize(function(){
	if($(window).width() < 999) {
		console.log("did it register?");
	    $('#fullpage').fullpage({
	    	scrollingSpeed: 7000,
	    	autoScrolling: false
	    });
	    $('.inner-arrow-container').css("display:none");
	   
	}
	if($(window).width() > 999) {
		console.log("did it restore?");
		$('#fullpage').fullpage();
		
		
	}


});

