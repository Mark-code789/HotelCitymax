window.onload = () => {
	document.querySelector("header > div:last-of-type").addEventListener("click", (e) => {
		e.target.classList.toggle("menu_toggle");
		document.querySelector("header > div:nth-of-type(2)").classList.toggle("menu_toggle");
	}, true);
	let inputs = new Map([['accommodation', document.querySelectorAll('.accommodation input')],
						  ['conferencing', document.querySelectorAll('.conferencing input')]
					     ]);
	document.querySelector("#service").addEventListener("change", (e) => {
		document.querySelector('.accommodation').style.display = 'none';
		document.querySelector('.conferencing').style.display = 'none';
		document.querySelector(`.${e.target.value}`).style.display = 'grid';
		
		for(let [service, input] of inputs.entries()) {
			if(service != e.target.value) {
				for(let elem of input) {
					elem.removeAttribute('required');
				} 
			} 
			else {
				for(let elem of input) {
					elem.setAttribute('required', true);
				} 
			} 
		} 
	});
	
	for(let date of document.querySelectorAll("input[type='date']")) {
		let d = new Date();
		date.min = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
		if(date.id == "check-out-date") {
			d.setDate(d.getDate() + 1);
			date.min = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
		} 
	} 
	
	for(let time of document.querySelectorAll("input[type='time']")) {
		let tm = new Date();
		tm.setHours(tm.getHours() + 1);
		time.min = String(tm.getHours()).padStart(2, "0") + ":" + String(tm.getMinutes()).padStart(2, '00') + ":00";
	} 
	
	document.querySelector("form").addEventListener("submit", (e) => {
		e.preventDefault();
		let templateParams = {};
		let service = document.querySelector('#service').value;
		templateParams.title = service.replace(/^\w/, (t) => t.toUpperCase()) + ' Booking';
		let data = '';
		for(let input of document.querySelectorAll(`form .${service} input, form .${service} select, form .common input, form .common textarea`)) {
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
									<th colspan=2>${service.replace(/^\w/, (t) => t.toUpperCase())}</th>
								</tr>
								${data}
							</table>
						</body>
					</html>`;
		templateParams.message = html;
		let submit = document.querySelector('.form input[type="submit"]');
		submit.classList.add("submitting");
		emailjs.send('gmail', 'template_m2t5hia', templateParams).then((res) => {
			alert('Your request has been sent. We will contact you shortly via the details you provided.');
			e.target.reset();
			document.querySelector(`#service option[value='accommodation']`).selected = true;
			document.querySelector(`#service option[value='accommodation']`).parentNode.dispatchEvent(new Event("change"));
			submit.classList.remove("submitting");
		}, (err) => {
			alert("An error occurred while sending your request. Please try again or contact us directly via the reservation contacts.");
			submit.classList.remove("submitting");
		});
	});
	
	
	document.querySelector("#check-in-date").addEventListener("change", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide date for arrival";
		} 
		else if(value) {
			let ams = new Date(value).getTime();
			let cms = new Date(new Date().toDateString()).getTime();
			if(ams < cms) {
				e.target.classList.add("danger");
				e.target.nextElementSibling.innerHTML = "Date for arrival should be today or later";
			} 
			else {
				let d = new Date(value);
				d.setDate(d.getDate() + 1);
				document.querySelector('#check-out-date').min = d.toISOString().split("T")[0];
			} 
		} 
	});
	
	document.querySelector("#check-out-date").addEventListener("change", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide date for departure";
		} 
		else if(value) {
			let dms = new Date(value).getTime();
			let cms = new Date(new Date().toDateString()).getTime();
			if(dms < cms + (24 * 60 * 60 * 1000)) {
				e.target.classList.add("danger");
				e.target.nextElementSibling.innerHTML = "Date for arrival should be tomorrow or later";
			} 
			else {
				e.target.classList.remove("danger");
			} 
		} 
	});
	
	document.querySelector("#conference-date").addEventListener("change", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide date for the conference";
		} 
		else if(value) {
			let coms = new Date(value).getTime();
			let cms = new Date(new Date().toDateString()).getTime();
			if(coms < cms) {
				e.target.classList.add("danger");
				e.target.nextElementSibling.innerHTML = "Date for conference should be today or later";
			} 
			else {
				e.target.classList.remove("danger");
			} 
		} 
	});
	
	document.querySelector("#conference-time").addEventListener("change", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide time for the conference";
		} 
		else if(value) {
			console.log(value);
			let coms = new Date();
			coms.setHours(value.split(':')[0]);
			coms.setMinutes(value.split(':')[1]);
			coms = coms.getTime();
			let cms = new Date().getTime();
			if(coms < cms) {
				e.target.classList.add("danger");
				e.target.nextElementSibling.innerHTML = "Time for conference should be now or later";
			} 
			else {
				e.target.classList.remove("danger");
			} 
		} 
	});
	
	document.querySelector("#conference-duration").addEventListener("keyup", (e) => {
		let value = e.target.value;
		if(!value) {
			e.target.classList.add("danger");
			e.target.nextElementSibling.innerHTML = "Please provide the duration of the conference";
		} 
		else if(value) {
			if(value <= 0) {
				e.target.classList.add("danger");
				e.target.nextElementSibling.innerHTML = "Duration for the conference should be more than zero";
			} 
			else if(value > 24) {
				e.target.classList.add("danger");
				e.target.nextElementSibling.innerHTML = "Duration for the conference should be less than 24";
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
	
	document.querySelector('.conferencing').style.display = 'none';
	document.querySelector('.loader').style.display = 'none';
	document.body.style.overflow = 'auto';
	CheckHREF();
}

const CheckHREF = () => {
	let url = new URL(window.location);
	let params = url.searchParams;
	let service = params.get("service");
	if(service) {
		document.querySelector('.main section').style.backgroundImage = 'linear-gradient(#0003, #0003), url("../src/images/sleep.png")';
		document.querySelector('.main h1').innerHTML = 'BOOK NOW<br><span></span><br><span>Comfort away from home</span>'
		document.querySelector(`#service option[value='${service}']`).selected = true;
		document.querySelector(`#service option[value='${service}']`).parentNode.dispatchEvent(new Event("change"));
		if(service == "accommodation") {
			let room = params.get('room');
			if(room) {
				document.querySelector(`#room option[value='${room}']`).selected = true;
				document.querySelector(`#room option[value='${room}']`).parentNode.dispatchEvent(new Event("change"));
			} 
		} 
		else if(service == "conferencing") {
			let hall = params.get('hall');
			if(hall) {
				document.querySelector(`#hall option[value='${hall}']`).selected = true;
				document.querySelector(`#hall option[value='${hall}']`).parentNode.dispatchEvent(new Event("change"));
			} 
		} 
		else {
			document.querySelector('.main section').style.backgroundImage = 'linear-gradient(#0003, #0003), url("../src/images/food.png")';
			document.querySelector('.main h1').innerHTML = 'ORDER NOW<br><span></span><br><span>Delicious and tasty meals</span>';
		} 
	} 
	else {
		document.querySelector(`#service option[value='accommodation']`).selected = true;
		document.querySelector(`#service option[value='accommodation']`).parentNode.dispatchEvent(new Event("change"));
	} 
} 