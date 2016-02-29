$( document ).ready(function() {
	// $('.arrow').hover(function(){ // hover in
	// 	$(this).attr('src', '../../../static/downarrow-purp.png');
	// }, function(){ // hover out
	// 	$(this).attr('src', '../../../static/downarrow.png' )
	// })

	$('.arrow-container, .features').hover(function(){
		$(this).children('img').toggle();
	})


    $('.arrow').click(function(){
    	console.log("clicked?")
    })







});