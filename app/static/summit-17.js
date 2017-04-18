$(document).ready(function() {
	// Hover in
	$( ".btn" ).hover(
  function() {
  	console.log($(this).siblings('img'));
  	if ($(this).siblings('.mlive-icon')) {  		
  		$( this ).siblings('.mlive-icon').attr('src', '../../static/marketo-live-circle-orange-logo.png');
  	};
  	if ($(this).siblings('.invision')) {  		
  		$( this ).siblings('.invision').attr('src', '../../static/invision-alt.png');
  	};
    
  	// Hover out 
  }, function() {
    if ($(this).siblings('.mlive-icon')) {  		
  		$( this ).siblings('.mlive-icon').attr('src', '../../static/marketo-live-circle-logo.png');
  	};
  	if ($(this).siblings('.invision')) {  		
  		$( this ).siblings('.invision').attr('src', '../../static/invision.png');
  	};
  }
);
});