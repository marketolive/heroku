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

	$('.section2-options').hover(function(){
		// mouse enter function
		var order = $(this).attr('data-order');
		var src = seo[order]["src"];
		
		console.log(src);
		$('#section2-header').text(seo[order]["header"]);
		$('.section2-copy').text(seo[order]["description"]);
		$('.section2-image-container').attr("src", src);
	}, function(){
		// console.log("mouse leave functioning?");
		// mouseleave
	});

});

$(window).resize(function(){
	if($(window).width() < 999) {
		console.log("did it register?");
	    $('#fullpage').fullpage({
	    	scrollingSpeed: 7000,
	    	autoScrolling: false
	    });
	    $('.inner-arrow-container').css("display", "none");
	   
	}
	else if($(window).width() > 999) {
		console.log("did it restore?");
		$('#fullpage').fullpage();

		$('.inner-arrow-container').css("display", "block");
		
	}


});

var seo = [
	{"header": "Search Optimization", "description": "Marketo Search Engine Optimization (SEO) is an easy-to-use resource that helps marketers without specialized knowledge drive more quality traffic to their website and landing pages.", "src":"{{ url_for('static', filename= 'drive1.png') }}"},
	{"header": "Social Promotions", "description": "Social marketing makes it easy for your prospects and customers to share your message.  According to a recent Forrester research report, 70% of consumers trust recommendations from a friend, whereas only 10% trust advertising.", "src":"{{ url_for('static', filename= 'drive2.png') }}"},
	{"header": "Personalization", "description": "Marketo Real-Time Personalization creates meaningful, real-time interactions with targeted individuals through dynamically generated, personalized communication across email, web, ads and mobile-- with an content management system (CMS) and with no IT involvement", "src":"{{ url_for('static', filename= 'drive3.png') }}"}
];

