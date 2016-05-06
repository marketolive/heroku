$(document).ready(function(){
	$('#fullpage').fullpage({
        	anchors:['FinancialServices', 'IncreaseBorrowerPipeline', 'DriveLoanRevenue', 'MeasureSuccess'],
        	verticalCentered: true,
        	resize: false
    	});
	    $('.arrow-container-down').click(function(){
	      $.fn.fullpage.moveSectionDown();
	    });

	    $('.arrow-container-up').click(function(){
	      $.fn.fullpage.moveSectionUp();
	    });	
	// if($(window).width() > 999) {
	//     $('#fullpage').fullpage({
 //        	anchors:['FinancialServices', 'IncreaseBorrowerPipeline', 'DriveLoanRevenue', 'MeasureSuccess'],
 //        	verticalCentered: true,
 //        	resize: false
 //    	});
	//     $('.arrow-container-down').click(function(){
	//       $.fn.fullpage.moveSectionDown();
	//     });

	//     $('.arrow-container-up').click(function(){
	//       $.fn.fullpage.moveSectionUp();
	//     });
	// }

	$('.section2-options, .section3-options, .section4-options, .section5-options').hover(function(){
		var order = $(this).attr('data-order');
		order = order.split('-');
		var section = order[0];
		order = order[1];

		$(this).parent().siblings('div').children('div').css({'background-color':'white', 'color':'black', 'cursor':'pointer'})
		
		var position = b2b[section][order]["bp"];
		
		$(this).css({'color': 'white', 'background-color': '#5a54a4'});
		$('#'+section+'-header').text(b2b[section][order]["header"]);
		$('.'+section+'-copy').text(b2b[section][order]["description"]);
		$('.'+section+'-image-container').css("background-position", position);
	});

	$('.section2-options').first().css({'color':'white'});
	$('.section3-options').first().css({'color':'white'});
	$('.section4-options').first().css({'color':'white'});
	$('.section5-options').first().css({'color':'white'});
});

// $(window).resize(function(){
// 	if($(window).width() < 999) {
// 		console.log("did it register?");
// 	    $('#fullpage').fullpage({
// 	    	scrollingSpeed: 7000,
// 	    	autoScrolling: false
// 	    });
// 	    $('.inner-arrow-container').css("display", "none");
	   
// 	}
// 	else if($(window).width() > 999) {
		
// 		$('#fullpage').fullpage();

// 		$('.inner-arrow-container').css("display", "block");
		
// 	}
// });

var b2b = {
	section2: [
	{"header": "Search Optimization", "description": "Marketo Search Engine Optimization (SEO) is an easy-to-use tool that helps marketers without specialized knowledge drive more quality traffic and potential borrowers to their website and landing pages.", "bp":"0% 0%"},
	{"header": "Capture Interests", "description": "Drive and increase conversions with relevant landing pages and forms designed with a clear call to action.", "bp":"58% 0%"},
	{"header": "Social Promotions", "description": "Marketo offers truly integrated social marketing that supports every aspect of your marketing strategy. Marketo helps you find people interested in your services, turn them into lifetime customers and retain them for life.", "bp":"116% 0%"}
	],
	section3: [
	{"header": "Email Marketing", "description": "With Marketo’s email capabilities marketers can put into action an immediate email strategy that incorporates the best email practices. Provide truly personalized experiences for your prospective and existing borrowers.", "bp":"0% 0%"},
	{"header": "Retargeting", "description": "Marketo Ad Bridge connects Marketo's rich behavioral data with Facebook, Google, LinkedIn and other advertising platforms, so marketers can target the right people with meaningful, relevant ads.", "bp":"30% 0%"},
	{"header": "Nurture", "description": "Marketo provides a platform for you to manage anything from a simple webinar all the way to large events, at scale with minimal rework.", "bp":"63% 0%"},
	{"header": "Events", "description": "Efficiently manage and execute marketing events to nurture prospective and existing customers that span all channels including email, web, mobile, events, direct mail, social media and more.", "bp":"100% 0%"},
	],
	section4: [
	{"header": "Borrower Engagement", "description": "Marketo's unique Engagement Score is a proprietary metric that outputs a single number to give marketers a fast, apples-to-apples method of measuring content performance", "bp":"0% 0%"},
	{"header": "ROI Analysis", "description": "Prove program effectiveness and identify which programs deliver the highest marketing ROI. Focus your marketing efforts on the highest driving campaigns and channels.", "bp":"48% 0%"},
	{"header": "Dashboards & Advanced Analytics", "description": "Create ad hoc reports and dashboards with an intuitive UI built for marketers. Get the data you need when you want it.", "bp":"100% 0%"}
	]
}


