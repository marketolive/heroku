$( document ).ready(function() {
	$('.arrow-container, .features').hover(function(){
		$(this).children('img').toggle();
	});

    $('.arrow').on('click', function(event){
    	// This is a routing function-- depending on the arrow they click I am activating a function specific to that section   	
    	if ($(event.target.parentNode.parentNode).hasClass('tofu absolute')){
    		var target = ($(this).parent()[0].id);
    		if(target == "tofu-up") {
    			scrollUp(target);
    		}
    		else {
    			scrollDown(target);
    		}
    	}
    	if ($(event.target.parentNode.parentNode).hasClass('mofu absolute')){
    		var target = ($(this).parent()[0].id);
    		if(target == "mofu-up") {
    			scrollUp(target);
    		}
    		else {
    			scrollDown(target);
    		}
    	}
    	if ($(event.target.parentNode.parentNode).hasClass('bofu absolute')){
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
    	if (target[0] == "mofu") {
    		scrollAmount = 165 
    	}
    	if (target[0] == "bofu") {
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
});


