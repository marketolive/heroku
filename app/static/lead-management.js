$( document ).ready(function() {
	$('.arrow-container, .features').hover(function(){
		$(this).find('img').toggle();
	});

    $('.arrow').on('click', function(event){
    	// This is a routing function-- depending on the arrow they click I am activating a function specific to that section   	
    	if ($(event.target.parentNode.parentNode).hasClass('tofu top-layer')){
    		var target = ($(this).parent()[0].id);
    		if(target == "tofu-up") {
    			scrollUp(target);
    		}
    		else {
    			scrollDown(target);
    		}
    	}
    	if ($(event.target.parentNode.parentNode).hasClass('mofu top-layer')){
    		var target = ($(this).parent()[0].id);
    		if(target == "mofu-up") {
    			scrollUp(target);
    		}
    		else {
    			scrollDown(target);
    		}
    	}
    	if ($(event.target.parentNode.parentNode).hasClass('bofu top-layer')){
    		var target = ($(this).parent()[0].id);
    		if(target == "bofu-up") {
    			scrollUp(target);
    		}
    		else {
    		scrollDown(target);
    		}
    	}    	
    });

    function scrollUp (target){
    	target= target.split("-");
    	var container = target[0] + "-container";

    	$('.'+ container).animate({
    		scrollTop: 0
    	}, 500);

    	container = container.split("-");
    	container = container[0];  

    	if ($(container).scrollTop() == null){
    		$('#'+container+'-down').css("opacity", 1);
	        $('#'+container+'-up').css("opacity", 0);
    	}
    }

    function scrollDown (target) {    	
    	target = target.split("-");    	
    	var scrollAmount;

    	if (target[0] == "tofu") {    		
    		scrollAmount = 180 
    	}
    	else {
            scrollAmount = 165
        }

    	var container = target[0] + "-container";
    	
    	$('.'+ container).animate({
    		scrollTop: scrollAmount
    	}, 500);    	

    	$('.'+ container).on('scroll', function() {    		
    		container = container.split("-");
    		container = container[0];    		
	        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
	            $('#'+container+'-down').css("opacity", 0);
	            $('#'+container+'-up').css("opacity", 1);
	        }
	    });   
    }

    /** Babel Code **/

    $('.logo-nav-container').hover(function(){
    $('.logo-nav-container').toggle();
    });
    $('.help-nav-container').hover(function(){
    $('.help-nav-container').toggle();
    });
    var dlpath = "/static/babel-model.json"
    var lang = window.location.pathname.split('/')[1]
    var category = window.location.pathname.split('/')[2]
    $.getJSON(dlpath)
      .done(function(data){
        
        var pageID, div, divID, divText, divLink, h2

        pageID = $('html').attr('id')
        h2 = $('h2')
        
        $('title').html(data[category].page_meta[pageID].title[lang])
        $('h1').html(data[category].page_meta[pageID].h1[lang])
        $('[babel]').each(function(){
            div = $(this)
            divID = div.context.id
            divLink = div.find('a')
            divText = div.find('p')

            divLink.attr('href', data[category].use_cases[divID].href[lang])
            divText.html(data[category].use_cases[divID].p[lang])
        });

        for(var i = 0; i < h2.length; i++){
            h2[i].innerHTML=data[category].page_meta[pageID].h2[lang][i] 
        }


      })
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });

    /** End Babel code **/
});


