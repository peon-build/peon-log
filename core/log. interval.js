const hour = 1000 * 60 * 60;
const minute = 1000 * 60;
const second = 1000;

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
 * Log interval
 * @param {Date} startDate
 * @param {Date} endDate
 * @return {string}
 */
function logInterval(startDate, endDate) {
	let string = [];
	let diff = endDate.getTime() - startDate.getTime();

	let hours = Math.floor(diff / hour);
	diff = diff - (hours * hour);
	if (hours > 0) {
		string.push(`${hours}h`);
	}

	let minutes = Math.floor(diff / minute);
	diff = diff - (minutes * minute);
	if (hours > 0 || minutes > 0) {
		string.push(`${pad(minutes, 2)}m`);
	}

	let seconds = Math.floor(diff / second);
	diff = diff - (seconds * second);
	if (hours > 0 || minutes > 0 || seconds > 0) {
		string.push(`${pad(seconds, 2)}s`);
	}

	string.push(`${pad(diff, 3)}ms`);

	return string.join(" ");
}
//export
module.exports = logInterval;