$(document).ready(function(){
	console.log("working?");
	if($(window).width() > 999) {
	    $('#fullpage').fullpage({
        	anchors:['HigherEducation', 'IncreaseStudentEnrollment', 'CommunicateAtScale', 'MeasureSuccess']
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

	$('.section2-options, .section3-options, .section4-options, .section5-options').hover(function(){
		// var parent = $(this).parent;
		// console.log(parent).get(0);
		// mouse enter function
		var order = $(this).attr('data-order');
		order = order.split('-');
		var section = order[0];
		order = order[1];
		
		var position = b2b[section][order]["bp"];
		
		$(this).css({'color': 'white', 'background-color': '#5a54a4'});
		$('#'+section+'-header').text(b2b[section][order]["header"]);
		$('.'+section+'-copy').text(b2b[section][order]["description"]);
		$('.'+section+'-image-container').css("background-position", position);
	}, function(){
		if ($(this).hasClass("purple-background")){
			$(this).css('background-color', 'white');
			$(this).children().first().css('color', 'black');
		}

		else {
			$(this).css({'color': 'black', 'background-color': 'white'});
		}
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
		
		$('#fullpage').fullpage();

		$('.inner-arrow-container').css("display", "block");
		
	}
});

var b2b = {
	section2: [
	{"header": "Search Optimization", "description": "Marketo Search Engine Optimization (SEO) is an easy-to-use resource that helps marketers without specialized knowledge drive more quality traffic and potential students to their website and landing pages.", "bp":"0% 0%"},
	{"header": "Capture Interest", "description": "Drive and increase patient conversions with relevant landing pages and forms designed with a clear call to action.", "bp":"68% 0%"},
	{"header": "Social Promotions", "description": "Marketo offers truly integrated social marketing that supports every aspect of your marketing strategy. Marketo helps you find people interested in your services, turn them into patients and retain them for life.", "bp":"110% 0%"}
	],
	section3: [
	{"header": "Email Marketing", "description": "With Marketo's email capabilities marketers can put into action an immediate email strategy that incorporates the best email practices.  Provide truly personalized experiences for your applicants and alumni that drive more engagement.", "bp":"0% 0%"},
	{"header": "Retargeting", "description": "Marketo Ad Bridge connects Marketo's rich behavioral data with Facebook, Google, LinkedIn and other advertising platforms, so marketers can target the right potential students with meaningful, relevant ads.", "bp":"20% 0%"},
	{"header": "Nurture", "description": "Efficiently manage and execute marketing programs to nurture prospective patients and patients that span all channels including email, web, mobile, events, direct mail, social media, and more.", "bp":"80% 0%"},
	{"header": "Events", "description": "Marketo provides a platform for you to manage anything from a simple webinar all the way to a large patient events, at scale with minimal rework.", "bp":"40% 0%"},
	],
	section4: [
	{"header": "Patient Engagement", "description": "Marketo's unique Engagement Score is a proprietary metric that outputs a single number to give marketers a fast, apples-to-apples method of measuring content performance", "bp":"-5% 0%"},
	{"header": "ROI Analysis", "description": "Prove program effectiveness and identify which programs deliver the highest marketing ROI. Focus your marketing efforts on the highest driving campaigns. Focus your marketing efforts on the highest performing channels and campaigns.", "bp":"48% 0%"},
	{"header": "Dashboards & Advanced Analytics", "description": "Create ad hoc reports and dashboards with an intuitive UI built for marketers. Get the data you need when you want it.", "bp":"100% 0%"}
	]
	// section5: [
	// {"header": "Executive Dashboard", "description": "Most CRMs and marketing automation software only capture attribution metrics with a single touch (e.g. a lead source).  Don't limit youself to a single-touch attribution model with Marketo.", "bp":"0% 0%"},
	// {"header": "Content Analysis", "description": "Identifying email engagement can be a challenge because opens and clicks are not a direct indicator of what drives a successful conversion.  Because of this, Marketo formulated an algorithm to calculate the end-to-end engagement of your content.  Even conversions that are further downtream from the initial email will be calculated as part of this 'Engagement Score'.", "bp":"50% 0%"},
	// {"header": "Flexible Reporting", "description": "Analytics and reporting provide an integral aspect of any decision making process.  As such, it is imperative to identify how your marketing efforts are performing, and to analyze their performance from different perspectives.", "bp":"100% 0%"}
	// ]
}


