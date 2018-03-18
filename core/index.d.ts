namespace PeonBuild {

	type Log = {
		LogLevel: LogLogLevel;
		level(level: LogLogLevel);

		setting(name: string, message: string, args?: Array<LogParam>);
		filename(message: string, args?: Array<LogParam>);
		debug(message: string, args?: Array<LogParam>);
		stacktrace(err);

		log(message: string, args?: Array<LogParam>);
		title(message: string, args?: Array<LogParam>);
		quote(status: boolean, message: string, args?: Array<LogParam>);
		assert(status: boolean, message: string, args?: Array<LogParam>);
		tip(message: string, args?: Array<LogParam>);
		code(message: string);
		timestamp(name: string, message: string, args?: Array<LogParam>);
		space();

		warning(message: string, args?: Array<LogParam>);

		error(message: string, args?: Array<LogParam>);

		ParamType: LogParamType;
		p: LogParameters
	}

	type LogSettings = {
		ok?: boolean;
		name?: string;
		type?: string;
		message?: string;
		args?: Array<LogParam>;
		logLevel?: PeonBuild.LogLogLevel;
	}

	type LogParameters = {
		url(value: Array<string> | string): LogParam;
		path(value: Array<string> | string): LogParam;
		id(value: Array<string> | string): LogParam;
		number(value: Array<string> | string): LogParam;
		text(value: Array<string> | string): LogParam;
		underline(value: Array<string> | string): LogParam;
	}

	type LogParam = {
		value: Array<string> | string;
		type: LogParamType;
	}

	type LoggerState = {
		level: LogLogLevel;
		timestamps: Map<string, Date>;
	}

	enum LogParamType {
		Url = "URL",
		Path = "PATH",
		Id = "ID",
		Number = "NUMBER",
		Text = "TEXT",
		Underline = "UNDERLINE"
	}

	enum LogLogLevel {
		All = "all",
		Info = "info",
		Warning = "warning",
		Error = "error"
	}

}