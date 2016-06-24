var body = document.querySelector('body');
var sfdc = document.querySelector('.salesforce-container');
var msd = document.querySelector('.dynamics-container');
var sfdcdialog = document.querySelector('.sfdc-dialog');
var msddialog = document.querySelector('.msd-dialog');
var closesfdc = document.querySelector('.closesfdc');
var closemsd = document.querySelector('.closemsd');

sfdc.addEventListener('click', function() {
	sfdcdialog.showModal();
});

msd.addEventListener('click', function() {
	msddialog.showModal();
})

closesfdc.addEventListener('click', function() {
	sfdcdialog.close();

});

closemsd.addEventListener('click', function () {
	msddialog.close();
})

body.addEventListener('click', function() {
	if (event.target.className == 'mdl-dialog sfdc-dialog'){
		sfdcdialog.close();
	}
	if (event.target.className == 'mdl-dialog msd-dialog'){
		msddialog.close();
	}	
});

