const axios = require('axios').default;


class Qiwi {
	constructor(apiKey, phone) {
		this.apiKey = apiKey;
		this.phone = phone;

		this.url = 'https://edge.qiwi.com';

		this.headers = {
			Accept: 'application/json',
			'content-type': 'application.json',
			Authorization: 'Bearer' + apiKey,
		};

		this.currencyCodes = {
			643: 'RUB',
			840: 'USD',
			978: 'EUR', 
			398: 'KZT',
		};
	}

	getTransHistory() {
		let options = {
			url: `${this.url}/funding-sources/v2/persons/${this.phone}/accounts`,
		};

		return this.get(options);
	} 

	async get(options) {
		if (!options.headers) options.headers = this.headers;

		try {
			let result = await axios.get(options.url, options);

			return result.data;
		} catch (err) {
			throw err;
		}
	}

	async post(options) {
		if (!options.headers) options.headers = this.headers;

		try {
			let result = await axios.post(options.url, options.body, options);

			return result.data;
		} catch (err) {
			throw err;
		}
	}

	async put(options) {
		if (!options.headers) options.headers = this.headers;

		try {
			let result = await axios.put(options.url, options.body, options);

			return result.data;
		} catch (err) {
			throw err;
		}
	}
}

module.exports = { Qiwi };