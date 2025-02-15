export class AjaxController {

    /**
	 * 
	 * @param {string} endpoint - The relative URL of the API endpoint.
	 * @param {string} [method='GET'] - The HTTP method to use (e.g., POST, GET, PUT).
	 * @param {Object|null} [body=null] - The JSON payload to send with the request (optional).
	 * @returns {Promise<Object>} - The parsed JSON response from the server.
	 * @throws {Error} - If the server returns a non-2xx HTTP status code or an invalid JSON response.
	 */
    static async fetchData(url:string, method='GET', body:Object=null) {
        const response = await fetch(url, 
        {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
			try {
				return await response.text();
			} catch (error) {
				throw new Error(response.status.toString())
			}
		}
        return await response.text();
    }
}