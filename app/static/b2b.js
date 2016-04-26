$(document).ready(function(){
	
	if($(window).width() > 999) {
	    $('#fullpage').fullpage({
        	anchors:['B2B-Marketing', 'DriveMoreAwareness', 'EngageYourCustomer', 'AlignWithSales', 'MeasureYourSuccess']
    	});
	    $('.arrow-container-down').click(function(){
	      $.fn.fullpage.moveSectionDown();
	    });
	    $('.arrow-container-up').click(function(){
	      $.fn.fullpage.moveSectionUp();
	    });
	}

	$('.section2-options, .section3-options, .section4-options, .section5-options').hover(function(){
		// mouse enter function
		var order = $(this).attr('data-order');
		order = order.split('-');
		var section = order[0];
		order = order[1];

		// removing the purple from the first child on hover
		$(this).parent().siblings('div').children('div').css({'background-color':'white', 'color':'black', 'cursor':'pointer'})
		
		var position = b2b[section][order]["bp"];
		
		$(this).css({'color': 'white', 'background-color': '#5a54a4'});
		$('#'+section+'-header').text(b2b[section][order]["header"]);
		$('.'+section+'-copy').text(b2b[section][order]["description"]);
		$('.'+section+'-image-container').css("background-position", position);
	});
	// , function(){
	// 	// mouse out function
	// 	if ($(this).hasClass("purple-background")){
	// 		$(this).css('background-color', 'white');
	// 		$(this).children().first().css('color', 'black');
	// 	}

	// 	else {
	// 		$(this).css({'color': 'black', 'background-color': 'white'});
	// 	}
	// });


	//set first option in each section color to white
	$('.section2-options').first().css({'color':'white'});
	$('.section3-options').first().css({'color':'white'});
	$('.section4-options').first().css({'color':'white'});
	$('.section5-options').first().css({'color':'white'});

});

$(window).resize(function(){
	if($(window).width() < 999) {
		// console.log("did it register?");
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
	{"header": "Search Optimization", "description": "Marketo's Search Engine Optimization (SEO) is an easy-to-use resource that helps marketers without specialized knowledge drive more quality traffic to their website and landing pages.", "bp":"-2% 0%"},
	{"header": "Personalization", "description": "Marketo Personalization creates meaningful, real-time interactions with targeted individuals through dynamically generated, personalized communication across email, web, ads and mobile-- without an content management system (CMS) and with no IT involvement.", "bp":"49% 0%"},
	{"header": "Social Promotions", "description": "Social marketing makes it easy for your prospects and customers to share your message.  According to a recent Forrester research report, 70% of consumers trust recommendations from a friend, whereas only 10% trust advertising.", "bp":"99% 0%"}
	],
	section3: [
	{"header": "Automate", "description": "Automated programs use triggers which provide you with the ability to listen in real-time for specific behaviors and respond immediately with an appropriate action (or set of actions), such as sending an email, alerting a sales rep or automating the customer lifecycle.", "bp":"0% 0%"},
	{"header": "Batch", "description": "When it comes to traditional email marketing efforts, a batch email program is easy to create and execute in Marketo.  From the control panel, you can define your audience, choose your content and schedule your batch email program in minutes.  Marketo provides you with the flexibility to work in the order that best fits your business needs", "bp":"20% 0%"},
	{"header": "Drip", "description": "Drip email marketing is used to send a series of emails over a specified period of time.  With Marketo, a drip email program is easy to create and execute.  From the campaign wizard, you can define your audience, create your content workflow and execute your drip email program in minutes.", "bp":"40% 0%"},
	{"header": "Nurture", "description": "Nurturing is the process of building relationships with your customers across various channels.  The goal of nurturing is to provide the right content to compel your prospect to move through the customer journey.  95% of the prospects visiting your website today are there to research and as many as 70% of them will eventually buy from you or from your competitor.", "bp":"60% 0%"},
	{"header": "Events", "description": "Events give you the unique opportunity to engage directly with prospects and customers, whether it's a traditional event, like a tradeshow or an online event, like a webinar.", "bp":"80% 0%"},
	{"header": "Calendar", "description": "It's hard to coordinate all of your marketing programs in flight across teams and regions.  The Marketo Marketing Calendar makes it easy for marketing teams to efficiently plan, coordinate and share the many great things happening in marketing.", "bp":"100% 0%"}
	],
	section4: [
	{"header": "Lead Scoring", "description": "Lead scoring is a shared sales and marketing methodology for ranking leads in order to determine their sales-readiness.  You score leads based on the interest they show in your business, their current stage in the buying cycle, and their fit in regards to your business.", "bp":"-5% 0%"},
	{"header": "Sales Notification", "description": "Automated programs use triggers which provide you with the ability to listen in real time for specific behaviors and respond immediately with an appropriate action (or set of actions), such as sending an email, alerting a sales rep or automating the customer lifecycle.", "bp":"48% 0%"},
	{"header": "Sales Insight", "description": "Relay the most important marketing engagements from your prospects and customers directly into the sales person's CRM account.  Then prioritize them to enable your reps to follow up with most the most sales-ready leads and not waste time on prospects that aren't ready to actively evaluate.", "bp":"100% 0%"}
	],
	section5: [
	{"header": "Executive Dashboard", "description": "Most CRMs and marketing automation software only capture attribution metrics with a single touch (e.g. a lead source).  Don't limit youself to a single-touch attribution model with Marketo.", "bp":"0% 0%"},
	{"header": "Content Analysis", "description": "Identifying email engagement can be a challenge because opens and clicks are not a direct indicator of what drives a successful conversion.  Because of this, Marketo formulated an algorithm to calculate the end-to-end engagement of your content.  Even conversions that are further downtream from the initial email will be calculated as part of this 'Engagement Score'.", "bp":"50% 0%"},
	{"header": "Flexible Reporting", "description": "Analytics and reporting provide an integral aspect of any decision making process.  As such, it is imperative to identify how your marketing efforts are performing, and to analyze their performance from different perspectives.", "bp":"100% 0%"}
	]
}

