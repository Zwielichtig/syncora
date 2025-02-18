import { Pin } from "../models/Pin";

export class AjaxController {

	public static AJAX_CONTROLLER_URL = '/ajax'

    /**
	 * 
	 * @param {string} endpoint - The relative URL of the API endpoint.
	 * @param {string} [method='GET'] - The HTTP method to use (e.g., POST, GET, PUT).
	 * @param {Object|null} [body=null] - The JSON payload to send with the request (optional).
	 * @returns {Promise<Object>} - The parsed JSON response from the server.
	 * @throws {Error} - If the server returns a non-2xx HTTP status code or an invalid JSON response.
	 */
    static async fetchData(body:any=null) {
		const response = await fetch(AjaxController.AJAX_CONTROLLER_URL, 
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: body ? JSON.stringify(body) : undefined,
			});

        if (!response.ok) {
			try {
				return await response.json();
			} catch (error) {
				throw new Error(response.status.toString())
			}
		}
        return await response.json();
    }


	static async uploadFile(fileData: string, filePath: string) {
		try {
			var body = {
				function:'upload-file',
				data: {
					file_data: fileData,
					filePath: filePath
				}
			};

			const response = await this.fetchData(body)
			//TODO Response Handling
		} catch (error) {
			//TODO Error Handling
		}
	}

	static async createCategory(name: string, color: string) {
		try {
			var body = {
				function:'create-category',
				data: {
					name: name,
					color: color
				}
			};

			const response = await this.fetchData(body)
			//TODO Response Handling
		} catch (error) {
			//TODO Error Handling
		}
	}

	static async getPinTypes() {
		try {
			var body = {
				function:'get-pin-types',
			};

			const response = await this.fetchData(body)
			console.log(response)
		} catch (error) {
			console.log(error)
		}
	}

	static async getUserCategories() {
		try {
			var body = {
				function:'get-user-categories',
			};

			const response = await this.fetchData(body)
			//TODO Response Handling
			console.log(response)
		} catch (error) {
			//TODO Error Handling
			console.log(error)
		}
	}

	static async getUserPins(username:string) {
		try {
			var body = {
				function:'get-user-pins',
				data: {
					username: username
				}
			};

			const response = await this.fetchData(body)
			//TODO Response Handling
		} catch (error) {
			//TODO Error Handling
		}
	}

	static async updatePins(pins: Pin[]) {
		try {
			let pinData :Array<Object> = []
			pins.forEach(pin => {
				pinData.push(pin.getPinContentData())
			});
			var body = {
				function:'update-notes',
				data: pinData
			};

			const response = await this.fetchData(body)
			//TODO Response Handling
		} catch (error) {
			//TODO Error Handling
		}
	}


	static async updateCategory(id:number, name:string, color:string) {
		try {
			var body = {
				function:'update-category',
				data: {
					id: id,
					name: name,
					color: color
				}
			};

			const response = await this.fetchData(body)
			//TODO Response Handling
		} catch (error) {
			//TODO Error Handling
		}
	}

	

}