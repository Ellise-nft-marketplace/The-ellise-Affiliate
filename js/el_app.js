function mount_data() {

	window.__ELISE_DATA__ = JSON.parse(document.getElementById("__ELISE_DATA__").textContent);

}
mount_data();
function setCookie(cname, cvalue, exhrs) {
	const d = new Date();
	d.setTime(d.getTime() + (exhrs * 60 * 60 * 1000));
	let expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
		c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function getLoginData() {
	return {
		formData: {
			email: "",
			password: ""
		},
		status: false,
		loading: false,
		loggedin: false,
		isError: false,
		errorMsg: "",
		buttonLabel: 'Log in',
		apiUrl: {
			baseUrl: '',
			liveApiHost: 'https://pacific-bayou-81308.herokuapp.com',
			loginEndpoint: '/api/login',
		},
		submitLogin() {
			// Ensures all fields have data before submitting
			if (!this.formData.email.length || 
				!this.formData.password.length) {
				// alert("Please fill out all required field and try again!")
				return;
		}
			this.buttonLabel = 'Logging in...'
			this.loading = true;
			fetch(this.apiUrl.liveApiHost+this.apiUrl.loginEndpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						// 'Access-Control-Allow-Origin': '*',
					},
					body: JSON.stringify(this.formData)
				})
				.then((response) => {
					// if (response.ok) {
					if (response.ok || response.status == 409) {
						return response.json();
						// return;
					} else {
						return Promise.reject(response);
					}
				})
				.then((resJson) => {
					this.status = true;
					console.log(resJson);
					if (resJson.accessToken && resJson.refreshToken) {
						setCookie("accessToken",resJson.accessToken,0.25);
						setCookie("refreshToken",resJson.refreshToken);
						window.location.href = __ELISE_DATA__.config.BASE_URL+__ELISE_DATA__.config.DASHBOARD;
					}
					else {
						this.isError = true;
						this.errorMsg = resJson.message;
					}
				})
				.catch((error) => {
					this.isError = true;
					console.log(error);
				})
				.finally(() => {
					this.loading = false;
					this.buttonLabel = 'Log in'
				})
		}
	}
}
function getRegData() {
	return {
		formData: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			passwordConfirmation: "",
		},
		status: false,
		loading: false,
		loggedin: false,
		isError: false,
		errorMsg: "",
		buttonLabel: 'Register',
		apiUrl: {
			baseUrl: '',
			liveApiHost: 'https://pacific-bayou-81308.herokuapp.com',
			regEndpoint: '/api/users',
		},
		submitReg() {
			// Ensures all fields have data before submitting
			if (!this.formData.email.length || 
				!this.formData.password.length) {
				// alert("Please fill out all required field and try again!")
				return;
		}
			this.buttonLabel = 'Signing up...'
			this.loading = true;
			fetch(this.apiUrl.liveApiHost+this.apiUrl.regEndpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						// 'Access-Control-Allow-Origin': '*',
					},
					body: JSON.stringify(this.formData)
				})
				.then((response) => {
					if(response.status === 200) {
						this.status = true;
						
						return response.json();
					} else{
						throw new Error ("SignUp failed");
					}

				})
				.then((resJson) => {
					console.log(resJson);
						this.isError = true;
						this.errorMsg = resJson.message;
					
				})
				.catch((error) => {
					this.isError = true;
					console.log(error);
				})
				.finally(() => {
					this.loading = false;
					this.buttonLabel = 'Log in'
				})
		}
	}
}
