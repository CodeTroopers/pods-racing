Date.prototype.addDays = function (days) {
	let result = new Date(this.valueOf());
	result.setDate(result.getDate() + days);
	return result;
};

Date.prototype.subtractDays = function (days) {
	let result = new Date(this.valueOf());
	result.setDate(result.getDate() - days);
	return result;
};
