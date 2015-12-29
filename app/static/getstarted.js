$(document).ready(function(){
	console.log("working?");
	if($(window).width() > 999) {
	    $('#fullpage').fullpage();
	    console.log("fullpage iniatilizing?XX");

	    $('.arrow-container-down').click(function(){
	      $.fn.fullpage.moveSectionDown();
	    });

	    $('.arrow-container-up').click(function(){
	      $.fn.fullpage.moveSectionUp();
	    });
	}

});

// $(window).resize(function(){
// 	if($(window).width() < 999) {
// 		console.log("did it register?");
// 	    $('#fullpage').fullpage({
// 	    	scrollingSpeed: 7000,
// 	    	autoScrolling: false
// 	    });
	   
// 	}
// 	if($(window).width() > 999) {
// 		console.log("did it restore?");
// 		$('#fullpage').fullpage();
		
		
// 	}


// });

