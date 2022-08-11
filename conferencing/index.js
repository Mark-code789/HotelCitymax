window.onload = () => {
	document.querySelector("header > div:last-of-type").addEventListener("click", (e) => {
		e.target.classList.toggle("menu_toggle");
		document.querySelector("header > div:nth-of-type(2)").classList.toggle("menu_toggle");
	}, true);
	
	for(let section of document.querySelectorAll(".explore .carrousel")) {
		let btns = section.querySelectorAll("button");
		let carrousel = new Carrousel(section.querySelectorAll("img"));
		for(let btn of btns) {
			btn.addEventListener('click', (e) => {
				if(e.target.classList.contains('forward')) {
					carrousel.forward();
				}
				else {
					carrousel.backward();
				}
			}, false);
		}
	} 
	document.querySelectorAll(".explore section div img")[1].scrollIntoView("auto");
	
	window.addEventListener('resize', () => {
		document.querySelectorAll(".explore section div img")[carrousel.showing].scrollIntoView("auto");
	});
	
	document.querySelector('.loader').style.display = 'none';
	document.body.style.overflow = 'auto';
}

class Carrousel {
	showing = 1;
	images = null;
	tm = null;
	it = null;
	constructor (images) {
		this.images = images;
		this.it = setInterval(this.loop, 5000);
	} 
	loop = () => {
		clearTimeout(this.tm);
		let image;
		if(this.showing < Math.floor(this.images.length / 2)) {
			this.forward(true);
		}
		else {
			this.forward(true);
			this.tm = setTimeout(() => {
				this.showing = 1;
				image = this.images[this.showing];
				image.scrollIntoView("auto");
			}, 2500);
		}
	}
	forward = (internal = false) => {
		if(!internal) {
			clearInterval(this.it);
			clearTimeout(this.tm);
		}
		let image;
		if(this.showing < Math.floor(this.images.length / 2) + 1) {
			this.showing++;
		}
		else {
			this.showing = 1;
			image = this.images[this.showing];
			image.scrollIntoView("auto");
			this.showing++;
		}
		image = this.images[this.showing];
		image.scrollIntoView();
		let dots = image.parentNode.parentNode.parentNode.parentNode.querySelectorAll("p span");
		image.parentNode.parentNode.parentNode.parentNode.querySelector("p span.showing").classList.remove("showing");
		dots[(this.showing - 1) % Math.floor(this.images.length / 2)].classList.add("showing");
	}
	backward = (internal = false) => {
		if(!internal) {
			clearInterval(this.it);
			clearTimeout(this.tm);
		}
		let image;
		if(this.showing > 1) {
			this.showing--;
		}
		else {
			this.showing = Math.floor(this.images.length / 2);
			image = this.images[this.showing];
			image.scrollIntoView("auto");
			this.showing--;
		}
		image = this.images[this.showing];
		image.scrollIntoView();
		let dots = image.parentNode.parentNode.parentNode.parentNode.querySelectorAll("p span");
		image.parentNode.parentNode.parentNode.parentNode.querySelector("p span.showing").classList.remove("showing");
		dots[(this.showing - 1) % Math.floor(this.images.length / 2)].classList.add("showing");
	}
}

Element.prototype.scrollIntoView = function(behavior = "smooth") {
	this.parentNode.parentNode.style.scrollBehavior = behavior;
	let left = this.parentNode.offsetLeft - ((this.parentNode.parentNode.clientWidth - this.parentNode.offsetWidth) / 2);
	this.parentNode.parentNode.scrollLeft = left;
}