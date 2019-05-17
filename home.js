/*******************************
** Author: Zach Reed
** Description: slideshow picture
********************************/

var slideIndex = 1; // start at first picture
showSlide(slideIndex);

function npSlides(idx) {
	showSlide(slideIndex += idx); 
}

function currentSlides(idx) {
	showSlide(slideIndex = idx);
}

function showSlide(idx) {
	var slides = document.getElementsByClassName("my_slide");
	
	if (idx > slides.length) {		// if greater than max, set to first
		slideIndex = 1;
	}
	
	if (idx < 1) {		// if less than first, set to last
		slideIndex = slides.length;
	}
	
	for (let i = 0; i  < slides.length; i++) {
		slides[i].style.display = "none";
	}
	
	// set active image
	slides[slideIndex -1].style.display = "block";
}
