Date.prototype.addDays = function (days) {
	var result = new Date(this.valueOf());
	result.setDate(result.getDate() + days);
	return result;
};

Date.prototype.subtractDays = function (days) {
	var result = new Date(this.valueOf());
	result.setDate(result.getDate() - days);
	return result;
};
