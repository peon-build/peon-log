/**
 * Pad
 * @param {number} number
 * @param {number} digits
 * @return {string}
 */
function pad(number, digits) {
	return new Array(Math.max(digits - String(number).length + 1, 0)).join("0") + number;
}

/**
 * Log time
 * @param {Date} date
 * @return {string}
 */
function logTime(date) {
	let dateString = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
	let timeString = date.getHours() + ":" + pad(date.getMinutes(), 2) + "." + pad(date.getMilliseconds(), 3);

	return [dateString, timeString].join(" ");
}
//export
module.exports = logTime;