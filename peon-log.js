//https://www.npmjs.com/package/commander

const program = /** @type {local.Command}*/require('commander');
const core = /** @type {PeonBuild.Log}*/require('./index')();

const pjson = require('./package.json');

const delimiter = ",";

const logLevelDefault = core.LogLevel.Info;
const messageDefault = "";
const typeDefault = "log";

/**
 * Fill settings
 * @param {string=} message
 * @param {local.Command=} env
 * @param {PeonBuild.LogSettings=} settings
 * @returns {PeonBuild.LogSettings}
 */
function fillSetting(message, env, settings) {
	let shortName,
		longName,
		options,
		value,
		args,
		name,
		i;

	//no provided
	if (!env) {
		return settings;
	}

	//normalize
	options = /** @type {Array.<local.Option>}*/env.options || [];
	args = /** @type {Array.<string>}*/env.rawArgs || [];
	settings = settings || {
		message: message || messageDefault,
		logLevel: logLevelDefault,
		type: typeDefault,
		name: "",
		ok: true,
		args: []
	};
	//iterate options and try to read data
	for (i = 0; i < options.length; i++) {
		longName = options[i].long;
		shortName = options[i].short;
		name = longName.replace("--", "");

		switch (name) {
		case "log-level":
			value = env["logLevel"];
			settings.logLevel = value || settings.logLevel;
			break;
		case "type":
			value = env["type"];
			settings.type = value || settings.type;
			break;
		case "fail":
			value = env["fail"];
			settings.ok = value === true ? false : settings.ok;
			break;
		case "message":
			value = env["message"];
			settings.message = value || settings.message;
			break;

		case "naming":
			value = env["naming"];
			settings.name = value || settings.name;
			break;
		case "url":
			value = env["url"] || "";
			settings.args[indexArg(args, longName, shortName)] = core.p.url(value.split(delimiter));
			break;
		case "path":
			value = env["path"] || "";
			settings.args[indexArg(args, longName, shortName)] = core.p.path(value.split(delimiter));
			break;
		case "id":
			value = env["id"] || "";
			settings.args[indexArg(args, longName, shortName)] = core.p.id(value.split(delimiter));
			break;
		case "number":
			value = env["number"] || "";
			settings.args[indexArg(args, longName, shortName)] = core.p.number(value.split(delimiter));
			break;
		case "text":
			value = env["text"] || "";
			settings.args[indexArg(args, longName, shortName)] = core.p.text(value.split(delimiter));
			break;
		case "underline":
			value = env["underline"] || "";
			settings.args[indexArg(args, longName, shortName)] = core.p.underline(value.split(delimiter));
			break;
		default:
			break;
		}
	}
	//parent
	fillSetting(message, env.parent, settings);
	//return settings
	return settings;
}

/**
 * Index arg
 * @param {Array.<string>} args
 * @param {string} longName
 * @param {string} shortName
 * @return {number}
 */
function indexArg(args, longName, shortName) {
	let index;

	//long name
	index = args.indexOf(longName);
	if (index >= 0) {
		return index;
	}
	//short name
	return args.indexOf(shortName);
}

/**
 * Normalize args
 * @param {Array} args
 * @return {Array}
 */
function normalizeArgs(args) {
	return args.filter((item) => item);
}

//options
program
	.version(pjson.version)
	//log levels flags
	.option('-L, --log-level <level>', `Set log level for log messages. Current default is '${logLevelDefault}'.`)
	//boolean flags
	.option('-F, --fail', `Mark message as fail. Is applicable only on some types of messages.`)
	.option('-N, --naming <name>', `Name of message. Is applicable only on some types of messages.`)
	//type
	.option('-T, --type <type>', `Type of message. Can be one of [log, warning, error, title, quote, setting, filename, assert]. Default type is '${typeDefault}'.`)

	//args
	.option('-w, --url <url>', `Set url that is injected into message. See examples in readme.`)
	.option('-p, --path <path>', `Set path that is injected into message. See examples in readme.`)
	.option('-i, --id <id>', `Set id that is injected into message. See examples in readme.`)
	.option('-n, --number <number>', `Set number that is injected into message. See examples in readme.`)
	.option('-t, --text <text>', `Set text that is injected into message. See examples in readme.`)
	.option('-u, --underline <underline>', `Set underline style that is injected into message. See examples in readme.`);

//message command
program
	.command('*')
	.description(`Log message into console. You can use $[0-9] for setting special colored arguments. See examples in readme. Default message is '${messageDefault}'.`)
	.action((message, env) => {
		let setting = fillSetting(message, env),
			args = normalizeArgs(setting.args);

		core.level(setting.logLevel);

		switch (setting.type) {
		case "warning":
			core.warning(setting.message, args);
			break;
		case "error":
			core.error(setting.message, args);
			break;
		case "tip":
			core.tip(setting.message, args);
			break;
		case "code":
			core.code(setting.message);
			break;
		case "title":
			core.title(setting.message, args);
			break;
		case "quote":
			core.quote(setting.ok, setting.message, args);
			break;
		case "assert":
			core.assert(setting.ok, setting.message, args);
			break;
		case "setting":
			core.setting(setting.name, setting.message, args);
			break;
		case "filename":
			core.filename(setting.message, args);
			break;
		case "debug":
			core.debug(setting.message, args);
			break;
		case "timestamp":
			core.timestamp(setting.name, setting.message, args);
			break;
		case "stacktrace":
			core.error(`Stacktrace message is not possible show from command line.`);
			break;
		default:
			core.log(setting.message, args);
			break;
		}
	});

//help :)
program.on('--help', function(){
	console.log('');
	console.log('');
	console.log('  Examples:');
	console.log('');
	console.log('    $ peon-log --help');
	console.log('    $ peon-log "Hi, im peon-log module!" -T log');
	console.log('    $ peon-log "Hi, im peon-log module!" -T title');
	console.log('    $ peon-log "Hi, this is negative quote style!" -T quote -F');
	console.log('    $ peon-log "This is a message with links $1!" --url https://github.com/peon-build/peon-log,https://github.com/peon-build/peon');
	console.log('    $ peon-log "Application route id is $1." --id #Q25h48gtu89drt');
	console.log('    $ peon-log "Application route with id $1 is $2!" -T warning --id #Q25h48gtu89drt --underline corrupted');
	console.log('');
});


//parse data
program.parse(process.argv);