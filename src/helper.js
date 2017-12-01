export function promisify(toPromisify) {
	return new Promise((resolve, reject) => {
		toPromisify((error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}