// function mount_data() {

// 	window.__ELISE_DATA__ = JSON.parse(document.getElementById("__ELISE_DATA__").textContent);

// }
// mount_data();
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
			// fetch(URL, OPTS)
			// .then(response => Promise.all([response, response.json()]))
			// .then(([response, json]) => {
			// 	if (!response.ok) {
			// 		throw new Error(json.message);
			// 	}

			// 	render(json);
			// })
			// .catch(exception => {
			// 	console.log(new Map([
			// 		[TypeError, "There was a problem fetching the response."],
			// 		[SyntaxError, "There was a problem parsing the response."],
			// 		[Error, exception.message]]).get(exception.constructor));
			// });
			fetch(this.apiUrl.liveApiHost+this.apiUrl.loginEndpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						// 'Access-Control-Allow-Origin': '*',
					},
					body: JSON.stringify(this.formData)
				})
				.then(response => Promise.all([response, response.json()]))
				.then(([response, resJson]) => {
					if (!response.ok) {
						throw new Error(resJson.message);
					}
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
				.catch(exception => {
					this.isError = true;
					let __lfkns = {
						'Error':exception.message,
						'TypeError':'There was a problem fetching the response, check your network connection',
						'SyntaxError':'Unknown Error, could not parse server response',
					};
					if (exception.name === "Error") {
						this.errorMsg = exception.message;
						console.log(exception.message);
					} else if (exception.name === "TypeError") {
						this.errorMsg = 'There was a problem logging in, check your network connection';
						console.log('There was a problem fetching the response, check your network connection');
					} else if (exception.name === "SyntaxError") {
						this.errorMsg = 'Unknown Error, could not parse server response';
						console.log('Unknown Error, could not parse server response');
					}
					// console.log(__lfkns.exceptionname);
					// window.__lfkns = new Map([
					// 	[TypeError, "There was a problem fetching the response."],
					// 	[SyntaxError, "There was a problem parsing the response."],
					// 	[Error, exception.message]]);
				})
				.finally(() => {
					this.loading = false;
					this.buttonLabel = 'Log in'
				});
			// fetch(this.apiUrl.liveApiHost+this.apiUrl.loginEndpoint, {
			// 		method: 'POST',
			// 		headers: {
			// 			'Content-Type': 'application/json',
			// 			// 'Access-Control-Allow-Origin': '*',
			// 		},
			// 		body: JSON.stringify(this.formData)
			// 	})
			// 	.then((response) => {
			// 		// if (response.ok) {
			// 		console.log(response.status,response);
			// 		return response.json();
			// 		if (response.ok || response.status == 409) {
			// 			// return;
			// 		} else {
			// 			return Promise.reject(response);
			// 		}
			// 	})
			// 	.then((resJson) => {
			// 		this.status = true;
			// 		console.log(resJson);
			// 		if (resJson.accessToken && resJson.refreshToken) {
			// 			setCookie("accessToken",resJson.accessToken,0.25);
			// 			setCookie("refreshToken",resJson.refreshToken);
			// 			window.location.href = __ELISE_DATA__.config.BASE_URL+__ELISE_DATA__.config.DASHBOARD;
			// 		}
			// 		else {
			// 			this.isError = true;
			// 			this.errorMsg = resJson.message;
			// 		}
			// 	})
			// 	.catch((error) => {
			// 		this.isError = true;
			// 		console.log(error);
			// 	})
			// 	.finally(() => {
			// 		this.loading = false;
			// 		this.buttonLabel = 'Log in'
			// 	})
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
		isSuccess: false,
		errorMsg: "",
		buttonLabel: 'Register',
		verifyUrl: '/verify.html',
		apiUrl: {
			baseUrl: '',
			liveApiHost: 'https://pacific-bayou-81308.herokuapp.com',
			regEndpoint: '/api/users',
		},
		submitReg() {
			// Ensures all fields have data before submitting
			if (!this.formData.firstName.length || 
			!this.formData.lastName.length || 
			!this.formData.email.length || 
			!this.formData.password.length || 
			!this.formData.passwordConfirmation.length) {
				this.isError =true;
				this.errorMsg = "Please fill out all fields and try again";
				// alert("Please fill out all required field and try again!")
				return;
			}
			this.buttonLabel = 'Signing up...'
			this.isError = false;
			this.loading = true;
			fetch(this.apiUrl.liveApiHost+this.apiUrl.regEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// 'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify(this.formData)
			})
			.then(response => Promise.all([response, response.json()]))
			.then(([response, resJson]) => {
				if (!response.ok) {
					throw new Error(resJson.message);
				}
				this.status = true;
				console.log(resJson);
				if (resJson.status == "success") {
					this.isSuccess = true;
					this.errorMsg = resJson.message;
					window.location.href = __ELISE_DATA__.config.BASE_URL+this.verifyUrl;
				}
				else {
					this.isError = true;
					this.errorMsg = resJson.message;
				}
			})
			.catch(exception => {
				this.isError = true;
				let __lfkns = {
					'Error':exception.message,
					'TypeError':'There was a problem fetching the response, check your network connection',
					'SyntaxError':'Unknown Error, could not parse server response',
				};
				if (exception.name === "Error") {
					this.errorMsg = exception.message;
					console.log(exception.message);
				} else if (exception.name === "TypeError") {
					this.errorMsg = 'There was a problem logging in, check your network connection';
					console.log('There was a problem fetching the response, check your network connection');
				} else if (exception.name === "SyntaxError") {
					this.errorMsg = 'Unknown Error, could not parse server response';
					console.log('Unknown Error, could not parse server response');
				}
				// console.log(__lfkns.exceptionname);
				// window.__lfkns = new Map([
				// 	[TypeError, "There was a problem fetching the response."],
				// 	[SyntaxError, "There was a problem parsing the response."],
				// 	[Error, exception.message]]);
			})
			.finally(() => {
				this.loading = false;
				this.buttonLabel = 'Register'
			});
		}
	}
}
