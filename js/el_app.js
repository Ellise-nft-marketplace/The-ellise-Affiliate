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

function deleteCookie(cname) {
	const d = new Date();
	d.setTime(d.getTime() - (100 * 60 * 60 * 1000));
	let expires = "expires="+d.toUTCString();
	document.cookie = cname + "=;" + expires + ";path=/";
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
function logout() {
	deleteCookie('refreshToken');
	deleteCookie('accessToken');
	window.location.href = __ELISE_DATA__.config.BASE_URL+__ELISE_DATA__.config.LOGIN;
}
function check_auth() {
	if (__ELISE_DATA__.config.AUTH) {
		if (getCookie('accessToken') != "" && getCookie('refreshToken') != "") {
			//good
			// window.location.href = __ELISE_DATA__.config.BASE_URL+__ELISE_DATA__.config.DASHBOARD;

		}else if (getCookie('refreshToken') != "") {
			//good
			// window.location.href = __ELISE_DATA__.config.BASE_URL+__ELISE_DATA__.config.DASHBOARD;
			fetch(__ELISE_DATA__.config.API_URL+__ELISE_DATA__.config.RTOKEN_ENDPOINT, {

				headers: {
					'Content-Type': 'application/json',
					'x-refresh': getCookie('refreshToken'),
				}
			})
			.then(response => Promise.all([response, response.json()]))
			.then(([response, resJson]) => {
				if (!response.ok) {
					logout();
				}
				this.status = true;
				console.log(resJson);
				if (resJson.accessToken) {
					setCookie("accessToken",resJson.accessToken,0.25);
				}
				else {
					logout();
				}
			})
			.finally(() => {
				this.loading = false;
			});

		}else{
			logout();
		}
	} else {
		if (getCookie('accessToken') != "" && getCookie('refreshToken') != "") {
			window.location.href = __ELISE_DATA__.config.BASE_URL+__ELISE_DATA__.config.DASHBOARD;
		}else{
			deleteCookie('refreshToken');
			deleteCookie('accessToken');
		}
	}
}
check_auth();
// logout();

function getDashboard() {
	return {
		isError: false,
		status: true,
		user: false,
		user:{},
		copiedLink:false,
		fetchUser() {
			fetch(__ELISE_DATA__.config.API_URL+__ELISE_DATA__.config.USER_ENDPOINT, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer '+getCookie('accessToken'),
				}
			})
			.then(response => Promise.all([response, response.json()]))
			.then(([response, resJson]) => {
				if (!response.ok) {
					throw new Error(resJson.message);
				}
				this.user = true;
				this.user = resJson;
				// var ref_id = this.user.referralLink;
				this.user.affiliateLink = window.location.origin+__ELISE_DATA__.config.REG_URL+'?ref='+this.user.referralLink;
				
			})
			.catch(exception => {
				this.isError = true;
			})
			.finally(() => {
				// this.loading = false;
				// this.buttonLabel = 'Log in'
			});
		},
		copyLink(){
			// this.
			var copyText = document.getElementById("affLink");
			copyText.select();
			copyText.setSelectionRange(0, 99999);
			navigator.clipboard.writeText(copyText.value);
			this.copiedLink = true;
			setTimeout(function () {
				this.copiedLink = false;
			}, 5000);
		}
	}
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
			email: "",
			password: "",
			passwordConfirmation: "",
			referrer: "",
		},
		status: false,
		loading: false,
		loggedin: false,
		isError: false,
		isSuccess: false,
		errorMsg: "",
		sponsorName:"<span class=\"text-success\"><i class=\"fa fa-load fa-spin\"></i>fetching sponsor...</span>",
		sponsorId: '',
		sponsorLink: '',
		sponsorValid: false,
		buttonLabel: 'Register',
		verifyUrl: '/verify.html',
		loginUrl: '/index.html',
		apiUrl: {
			baseUrl: '',
			// liveApiHost: 'http://localhost:3000',
			liveApiHost: 'https://pacific-bayou-81308.herokuapp.com',
			regEndpoint: '/api/users',
			sponsorEndpoint: '/api/affiliate/',
		},
		fetchSponsor() {
			const urlParams = new URLSearchParams(location.search);
			const ref_id = urlParams.get('ref');
			this.sponsorLink = ref_id;
			fetch(this.apiUrl.liveApiHost+this.apiUrl.sponsorEndpoint+ref_id)
			.then(response => Promise.all([response, response.json()]))
			.then(([response, resJson]) => {
				if (!response.ok) {
					throw new Error(resJson.message);
				}
				this.status = true;
				console.log(resJson);
				this.sponsorValid = true;
				this.formData.referrer = resJson.sponsor.id;
				this.sponsorId = resJson.sponsor.id;
				this.sponsorName = "<span class=\"\">Sponsor: "+resJson.sponsor.name+"</span>";
			})
			.catch(resJson => {
				this.sponsorValid = false;
				this.formData.referrer = "random";
				this.sponsorName = "<span class=\"text-danger\">invalid sponsor, you'll be assigned to a random sponsor</span>";
				if (resJson.name === "Error") {
					console.log(resJson.message);
					this.formData.referrer = resJson.sponsor.id;
					this.sponsorId = resJson.sponsor.id;
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
		},
		submitReg() {
			// Ensures all fields have data before submitting
			if (!this.formData.firstName.length || 
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
					window.location.href = __ELISE_DATA__.config.BASE_URL;
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
