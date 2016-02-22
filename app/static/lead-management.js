$( document ).ready(function() {
	$('.arrow').hover(function(){ // hover in
		$(this).attr('src', '../../../static/downarrow-purp.png');
	}, function(){ // hover out
		$(this).attr('src', '../../../static/downarrow.png' )
	})


    $('.arrow').click(function(){
    	console.log("clicked?")
    })







});