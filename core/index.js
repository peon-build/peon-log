const chalk = require('chalk');
const lt = require('./log.time');
const li = require('./log. interval');


const title = chalk.bold.underline;
const url = chalk.blue;
const path = chalk.underline.blue;
const id = chalk.bgGreen.black;
const option = chalk.italic.white;
const number = chalk.bold.magentaBright;
const boldOk = chalk.bold.green;
const boldFail = chalk.bold.red;
const error = chalk.bold.red;
const underline = chalk.underline;
const warning = chalk.bold.yellow;
const dollars = chalk.magentaBright;
const debug = chalk.black.bgWhite;
const time = chalk.cyanBright;
const tip = chalk.yellowBright.underline;
const question = chalk.yellowBright.bold;
const code = chalk.italic.white;
const codePrefix = chalk.blue.bold;

const splitter = "\u2028";
const colored = "\u241E";

const paramType = {
	Url: "URL",
	Path: "PATH",
	Id: "ID",
	Number: "NUMBER",
	Text: "TEXT",
	Underline: "UNDERLINE"
};

const logLevel = {
	All:  "all",
	Info: "info",
	Warning: "warning",
	Error: "error"
};

/**
 * Process message
 * @param {string} message
 * @param {Array.<PeonBuild.LogParam>=} args
 * @return {Array.<string|object>}
 */
function processMessage(message, args) {
	let i,
		param;

	args = args || [];

	for (i = 0; i < args.length; i++) {
		param = processParam(args[i]);
		//replace param
		message = message.replace(new RegExp("\\$" + (i + 1), "gi"), splitter + colored + param + splitter);
	}

	return message.split(splitter);
}

/**
 * Process param
 * @param {PeonBuild.LogParam} param
 * @return {string}
 */
function processParam(param) {
	//switch by type
	switch (param.type) {
	case paramType.Url:
		return url(processValue(param.value));
	case paramType.Path:
		return path(processValue(param.value));
	case paramType.Id:
		return id(processValue(param.value));
	case paramType.Number:
		return number(processValue(param.value));
	case paramType.Underline:
		return underline(processValue(param.value));
	default:
		return processValue(param.value);
	}

}

/**
 * Process value
 * @param {string|Array} value
 * @return {string}
 */
function processValue(value) {
	//array
	if (value.constructor === [].constructor) {
		return value.join(", ");
	}
	//string
	return value;
}

/**
 * Concat message
 * @param {function} modifier
 * @param {Array.<string>} value
 * @return {string}
 */
function concatMessage(modifier, value) {
	let i,
		val,
		text = "";

	for (i = 0; i < value.length; i++) {
		val = value[i];
		//is already colored
		if (val[0] === colored) {
			text += val.substr(1);
		} else {
			text += modifier ? modifier(val) : val;
		}
	}

	return text;
}

/**
 * Show message
 * @param {PeonBuild.LoggerState} state
 * @param {PeonBuild.LogLogLevel} level
 * @param {string} value
 */
function showMessage(state, level, value) {
	//check level type
	if (levelValue(state.level) < levelValue(level)) {
		return;
	}
	//log
	console.log(value);
}

/**
 * Level value
 * @param {PeonBuild.LogLogLevel} level
 * @return {number}
 */
function levelValue(level) {
	switch (level) {
	case logLevel.All:
		return 1000;
	case logLevel.Info:
		return 500;
	case logLevel.Warning:
		return 250;
	case logLevel.Error:
		return 100;
	default:
		return 0;//off
	}
}


function peonLog() {
	let state = /** @type {PeonBuild.LoggerState}*/{
		level: logLevel.Info,
		timestamps: {}
	};

	//interface
	return {

		//enums
		LogLevel: logLevel,
		ParamType: paramType,

		/**
		 * Level
		 * @description Set level of logging
		 * @param {PeonBuild.LogLogLevel} level
		 */
		level(level) {
			state.level = level;
		},


		//#LEVEL: ALL

		/**
		 * Setting
		 * @description Report command line option or current module setting
		 * @param {string} name
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		setting(name, message, args) {
			let text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.All,
				[" - ",  option(name + ":"), concatMessage(null, text)].join(" ")
			);
		},

		/**
		 * Filename
		 * @description Report touched file, is used only for all and debug logging.
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		filename(message, args) {
			let mark = " $$ ",
				text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.All,
				[dollars(mark), concatMessage(option, text)].join(" ")
			);
		},

		/**
		 * Debug
		 * @description Report debug info that is not normally visible.
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		debug(message, args) {
			let text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.All,
				concatMessage(debug, text)
			);
		},

		/**
		 * Stacktrace
		 * @description Is used for logging stack trace into console
		 * @param {Error} err
		 */
		stacktrace(err) {
			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.All,
				concatMessage(error, [err.stack])
			);
		},

		//#LEVEL: INFO

		/**
		 * Title
		 * @description Title line for some important plugins
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		title(message, args) {
			let text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info,
				concatMessage(title, text)
			);
		},

		/**
		 * Log
		 * @description Basic log function, can by anything
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		log(message, args) {
			let text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info,
				concatMessage(null, text)
			);
		},

		/**
		 * Quote
		 * @description Quoted line with status. Can be red or green. Use process done or fail report.
		 * @param {boolean} status
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		quote(status, message, args) {
			let text = processMessage(message, args),
				mark = " >>",
				msg;

			msg = status ? boldOk(mark) : boldFail(mark);
			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info,
				[msg, concatMessage(null, text)].join(" ")
			);
		},

		/**
		 * Assert
		 * @description Quoted line with status. Can be red or green. Use process done or fail report.
		 * @param {boolean} status
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		assert(status, message, args) {
			let text = processMessage(message, args),
				mark,
				msg;

			mark = status ? "   ✓ " : "  ✗ ";
			text.unshift(mark);
			msg = status ? concatMessage(boldOk, text) : concatMessage(boldFail, text);
			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info, msg);
		},

		/**
		 * Tip
		 * @description Show tip or hint info for user
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		tip(message, args) {
			let text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info,
				[question(" (?) "), concatMessage(tip, text)].join(" ")
			);
		},

		/**
		 * Timestamp
		 * @description Timestamp is used for reporting time info into console
		 * @param {string} name
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		timestamp(name, message, args) {
			let parts,
				date = new Date(),
				text = processMessage(message, args);

			//message parts
			parts = [time(" ■ "),  time(lt(date)), option(name + ":"), concatMessage(null, text)];

			//already exists
			if (state.timestamps[name]) {
				//get difference
				parts.push(" +" + li(state.timestamps[name], date));
				delete state.timestamps[name];

			//create new
			} else {
				//add
				state.timestamps[name] = date;
			}

			//show start
			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info, parts.join(" "));
		},

		/**
		 * Code
		 * @description Print code line into console with specified form.
		 * @param {string} codeLine
		 */
		code(codeLine) {
			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info,
				[codePrefix("    | "), concatMessage(code, [codeLine])].join(" ")
			);
		},

		/**
		 * Space
		 * @description Make blank line into console
		 */
		space() {
			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Info, "");
		},

		//#LEVEL: WARNING

		/**
		 * Warning
		 * @description Report raw error
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		warning(message, args) {
			let text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Warning, concatMessage(warning, text));
		},

		//#LEVEL: ERROR

		/**
		 * Error
		 * @description Report raw error
		 * @param {string} message
		 * @param {Array.<PeonBuild.LogParam>=} args
		 */
		error(message, args) {
			let text = processMessage(message, args);

			showMessage(state, /** @type {PeonBuild.LogLogLevel}*/logLevel.Error, concatMessage(error, text));
		},

		//params
		p: {

			/**
			 * Url
			 * @param {string|Array} value
			 * @return {PeonBuild.LogParam}
			 */
			url(value) {
				let param = /** @type {PeonBuild.LogParam}*/{};

				param.value = value;
				param.type = paramType.Url;

				return param;
			},

			/**
			 * Path
			 * @param {string|Array} value
			 * @return {PeonBuild.LogParam}
			 */
			path(value) {
				let param = /** @type {PeonBuild.LogParam}*/{};

				param.value = value;
				param.type = paramType.Path;

				return param;
			},

			/**
			 * Id
			 * @param {string|Array} value
			 * @return {PeonBuild.LogParam}
			 */
			id(value) {
				let param = /** @type {PeonBuild.LogParam}*/{};

				param.value = value;
				param.type = paramType.Id;

				return param;
			},

			/**
			 * Number
			 * @param {string|Array} value
			 * @return {PeonBuild.LogParam}
			 */
			number(value) {
				let param = /** @type {PeonBuild.LogParam}*/{};

				param.value = value;
				param.type = paramType.Number;

				return param;
			},

			/**
			 * Text
			 * @param {string|Array} value
			 * @return {PeonBuild.LogParam}
			 */
			text(value) {
				let param = /** @type {PeonBuild.LogParam}*/{};

				param.value = value;
				param.type = paramType.Text;

				return param;
			},

			/**
			 * Underline
			 * @param {string|Array} value
			 * @return {PeonBuild.LogParam}
			 */
			underline(value) {
				let param = /** @type {PeonBuild.LogParam}*/{};

				param.value = value;
				param.type = paramType.Underline;

				return param;
			}
		}

	}
}
//export
module.exports = peonLog;