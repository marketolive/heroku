function getOrDefault(data, key1, key2) {
	console.log("Get or default:");
	var datasub1 = key1 in data ? data[key1] : data["www"];
	console.log(datasub1);
	var datasub2 = key2 in datasub1 ? datasub1[key2] : datasub1["en"];
	console.log(datasub2);
	return (datasub2);
}

$(document).ready(function(){

	$('#fullpage').fullpage({
        	anchors:['HigherEducation', 'IncreaseStudentEnrollment', 'BuildLastingRelationships', 'MeasureSuccess'],
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
 //        	anchors:['HigherEducation', 'IncreaseStudentEnrollment', 'BuildLastingRelationships', 'MeasureSuccess']
 //    	});
	//     $('.arrow-container-down').click(function(){
	//       $.fn.fullpage.moveSectionDown();
	//     });

	//     $('.arrow-container-up').click(function(){
	//       $.fn.fullpage.moveSectionUp();
	//     });
	// }
	$.getJSON('/static/content.json')
	  .done(function(data){
	  	//get language from url
	  	var splitpath = window.location.pathname.split('/');
	  	var language = splitpath[1];
	  	//console.log(language);
	  	//get page name from url
	  	var page = splitpath[3].split('#')[0];
	  	//console.log(page);

	  	//get subdomain
	  	var subdomain = window.location.hostname.split('.')[0];
		//console.log(subdomain);

		//console.log(data);	

		// QUESTIONS:
		// 1) Single json file or 1 per page - 1 Per page
		// 2) JSON structure
		// 3) Features to account for, e.g. higher-ed hover pagination
		// 
		// 4) Links separate or on page


	  	$('[dynId]').each(function(){
	  		//get dynId name
	  		var dynId = $(this).attr('dynId');
	  		//console.log(dynId);
	  		//get content value from json
	  		var dynData = data[page][dynId];
	  		//console.log(dynData);

	  		if (Array.isArray(dynData)) {
	  			var parentElement = $(this);
  				$('[dynsublink]', this).each(function(){
  					var dynsub = +($(this).attr('dynsublink'))-1;
  					console.log(dynsub);
					var linklabel = dynData[dynsub]["link-label"];
					$(this).text(getOrDefault(linklabel, subdomain, language));
					$(this).hover(function(){
						for (key in dynData[dynsub]) {
							console.log(key, dynData[dynsub][key])
							if (key != "link-label") {
								$('[dynsub="'+key+'"]', parentElement).text(getOrDefault(dynData[dynsub][key], subdomain, language))
							}
						}
					});
  				});
	  		} else {
		  		// Ternary operator used below to set default to "www" and/or "en" if an
		  		// alternate subdomain and/or language cannot be found in the content.json
		  		var subdomainData = subdomain in dynData ? dynData[subdomain] : dynData["www"];
		  		console.log(subdomainData);
		  		var elementData = language in subdomainData ? subdomainData[language] : subdomainData["en"];
		  		console.log(elementData);
	        	$(this).text(elementData);
	        }
	  	});
	  })
	  .fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	  });

	// $('.section2-options, .section3-options, .section4-options, .section5-options').hover(function(){
	// 	var order = $(this).attr('data-order');
	// 	order = order.split('-');
	// 	var section = order[0];
	// 	order = order[1];

	// 	$(this).parent().siblings('div').children('div').css({'background-color':'white', 'color':'black', 'cursor':'pointer'})

		
	// 	var position = b2b[section][order]["bp"];
		
	// 	$(this).css({'color': 'white', 'background-color': '#5a54a4'});
	// 	$('#'+section+'-header').text(b2b[section][order]["header"]);
	// 	$('.'+section+'-copy').text(b2b[section][order]["description"]);
	// 	$('.'+section+'-image-container').css("background-position", position);
	// });
	// }, function(){
	// 	if ($(this).hasClass("purple-background")){
	// 		$(this).css('background-color', 'white');
	// 		$(this).children().css('color', 'black');
	// 	}

	// 	else {
	// 		$(this).css({'color': 'black', 'background-color': 'white'});
	// 	}
	
	//set first option in each section color to white
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

// var b2b = {
// 	section2: [
// 	{"header": "Search Optimization", "description": "Marketo Search Engine Optimization (SEO) is an easy-to-use tool that helps marketers without specialized knowledge drive more quality traffic and potential students to their website and landing pages.", "bp":"1% 0%"},
// 	{"header": "Capture Applicants", "description": "Drive and increase applicant conversions with relevant landing pages and forms designed for each school & campaign with a clear call to action", "bp":"50% 0%"},
// 	{"header": "Social Promotions", "description": "Marketo offers truly integrated social marketing that supports every aspect of your marketing strategy.  Marketo helps you find new applicants, turn applicants into students and turn students into advocates.", "bp":"100% 0%"}
// 	],
// 	section3: [
// 	{"header": "Email Marketing", "description": "With Marketo's email capabilities marketers can put into action an immediate email strategy that incorporates the best email practices.  Provide truly personalized experiences for your applicants and alumni that drive more engagement.", "bp":"0% 0%"},
// 	{"header": "Retargeting", "description": "Marketo Ad Bridge connects Marketo's rich behavioral data with Facebook, Google, LinkedIn and other advertising platforms, so marketers can target the right potential students with meaningful, relevant ads.", "bp":"35% 0%"},
// 	{"header": "Nurture", "description": "Marketo provides a platform for you to manage anything from a simple webinar all the way to a large scale student recruitment events, at scale with minimal work.", "bp":"66% 0%"},
// 	{"header": "Events", "description": "Efficiently manage and execute marketing programs to nurture students & alumni that span all channels including email, web, mobile, events, direct mail, social media, and more.", "bp":"99% 0%"},
// 	],
// 	section4: [
// 	{"header": "Student Engagement", "description": "Marketo's unique Engagement Score is a proprietary metric that outputs a single number to give marketers a fast, apples-to-apples method of measuring content performance", "bp":"0% 0%"},
// 	{"header": "ROI Analysis", "description": "Prove program effectiveness and identify which programs deliver the highest marketing ROI. Focus your marketing efforts on the highest driving campaigns and channels", "bp":"48% 0%"},
// 	{"header": "Dashboards & Advanced Analytics", "description": "Create ad hoc reports and dashboards with an intuitive UI built for marketers. Get the data you need when you want it.", "bp":"100% 0%"}
// 	]
// }
