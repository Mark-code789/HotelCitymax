window.onload = () => {
	document.querySelector("header > div:last-of-type").addEventListener("click", (e) => {
		e.target.classList.toggle("menu_toggle");
		document.querySelector("header > div:nth-of-type(2)").classList.toggle("menu_toggle");
	}, true);
	
	document.querySelector('.loader').style.display = 'none';
	document.body.style.overflow = 'auto';
}