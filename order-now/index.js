window.onload = () => {
	document.querySelector("header > div:last-of-type").addEventListener("click", (e) => {
		e.target.classList.toggle("menu_toggle");
		document.querySelector("header > div:nth-of-type(2)").classList.toggle("menu_toggle");
	}, true);
	
	for(let time of document.querySelectorAll("input[type='time']")) {
		let tm = new Date();
		tm.setHours(tm.getHours() + 1);
		tm.setMinutes(tm.getMinutes() + 30);
		time.min = String(tm.getHours()).padStart(2, "0") + ":" + String(tm.getMinutes()).padStart(2, "0") + ":00";
	} 
	
	document.querySelector("form").addEventListener("submit", (e) => {
		e.preventDefault();
		let templateParams = {};
		templateParams.title = 'Food Order';
		let data = '';
		for(let input of document.querySelectorAll(`.form .restaurant input, .form .restaurant select, .form .common input, .form .common textarea`)) {
			data += `<tr><td>${input.name}</td><td>${input.value || 'none'}</td></tr>`;
		} 
		let html = `<html>
						<head>
							<style>
								table {
									width: 100%;
									table-layout: fixed;
									border-collapse: collapse;
									font-size: 1em;
								} 
								tr {
									border: none;
								} 
								td {
									padding: 8px;
									border: 1px solid #888; 
								} 
								tr td:first-of-type {
									font-weight: 700;
								} 
								th {
									background: #584193;
									color: #fff;
									font-size: 1.2em;
									text-align: center;
									padding: 8px;
									border: 1px solid #888; 
								} 
							</style>
						</head>
						<body>
							<table>
								<tr>
									<th colspan=2>Food Order</th>
								</tr>
								${data}
							</table>
						</body>
					</html>`;
		templateParams.message = html;
		if(!navigator.onLine) return alert("Can't complete request at this time.");
		let submit = document.querySelector('.form input[type="submit"]');
		submit.classList.add("submitting");
		emailjs.send('gmail', 'template_m2t5hia', templateParams).then((res) => {
			alert('Your request has been sent. We will contact you shortly via the details you provided.');
			e.target.reset();
			submit.classList.remove("submitting");
		}, (err) => {
			alert("An error occurred while sending your request. Please try again or contact us directly via the reservation contacts.");
			submit.classList.remove("submitting");
		});
	});
	
	document.querySelector("#order").addEventListener("keyup", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide the order";
		} 
		else {
			e.target.classList.remove("danger");
		} 
	});
	
	document.querySelector("#order-time").addEventListener("change", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide time for the conference";
		} 
		else if(value) {
			let coms = new Date();
			coms.setHours(value.split(':')[0]);
			coms.setMinutes(value.split(':')[1]);
			coms = coms.getTime();
			let cms = new Date().getTime();
			if(coms < cms + (1.5 * 60 * 60 * 1000)) {
				e.target.classList.add("danger");
				e.target.nextElementSibling.innerHTML = "Time for eating should be at least 1h 30min from now.";
			} 
			else {
				e.target.classList.remove("danger");
			} 
		} 
	});
	
	document.querySelector("#name").addEventListener("keyup", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide your name";
		} 
		else {
			e.target.classList.remove("danger");
		} 
	});
	
	document.querySelector("#email").addEventListener("keyup", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide your email";
		} 
		else {
			e.target.classList.remove("danger");
		} 
	});
	
	document.querySelector("#tel").addEventListener("keyup", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide your phone number";
		} 
		else {
			e.target.classList.remove("danger");
		} 
	});
	
	document.querySelector('.loader').style.display = 'none';
	document.body.style.overflow = 'auto';
}