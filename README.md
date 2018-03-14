## @peon-build/peon-log

Logger for peon build tool. It can be used like command line tool or include into nodejs project and use internal 
module API for printing messages.

### Motivation

Peon build can use nice and unified logger that can log some special messages and provide also basic messages like
`log`, `warning` and `error`.

### Installation
Peon log is available as the `@peon-build/peon-log` package on npm. You can install it by command that is showed 
after this text. Peon log is also installed with peon itself so it is installed automatically with peon-build.

```cmd
npm install @peon-build/peon-log
```

### Docs and usage

On start of you project you can include module into js file like is describe below. Or you can use command line
alternative to show help and learn how to use it.

```javascript
 /** @type {PeonBuild.Log}*/
 const log = require('@peon-build/peon-log')();
```
```cmd
peon-log --version
peon-log --help
```

#### LogLevel, ParamType

This enum are used for setting log level, there are available on `log` instance and you can read it as is showed below.

```javascript
 const logLevel = log.LogLevel;
 const paramType = log.ParamType;
```

#### `log.level(level)`

This is method that can set logging level into current instance of logger. You can set what to show by rules that
are describe here. You can see command line argument for set log level.

 - **all (`log.LogLevel.All`):** All messages are included event calls like `filename` or `setting`,
 - **info (`log.LogLevel.Info`):** All important messages are printed. It include `asserts`, `quote`, `log`, `title`, ...
 - **warning (`log.LogLevel.Warning`):** Errors and warnings are printed into console.
 - **error (`log.LogLevel.Error`):** Only errors are printed into console.

```javascript
 log.level(log.LogLevel.Warning);
```
```cmd
peon-log -L all
peon-log -L warning
```

#### `log.log(message, args)`

Print standard text messages send in `message` param into console without special coloring except arguments provided.
See [arguments](#arguments) section for more info.

![Basic log](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_log.PNG)

```javascript
 log.log("Hi, im peon-log module!", []);
```
```cmd
peon-log "Hi, im peon-log module!" -T log
peon-log "Hi, im peon-log module!"
```


#### `log.warning(message, args)`

Print warning text messages send in `message` param into console with coloring for warning. Arguments provided in `args`
can change coloring of parts of message.
See [arguments](#arguments) section for more info.

![Basic warning](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_warning.PNG)

```javascript
 log.warning("Hi, im peon-log module!", []);
```
```cmd
peon-log "Hi, im peon-log module!" -T warning
```

#### `log.error(message, args)`

Print error text messages send in `message` param into console with coloring for error. Arguments provided in `args`
can change coloring of parts of message.
See [arguments](#arguments) section for more info.

![Basic error](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_error.PNG)

```javascript
 log.error("Hi, im peon-log module!", []);
```
```cmd
peon-log "Hi, im peon-log module!" -T error
```

#### `log.title(message, args)`

Print title text messages send in `message` param into console with coloring for title. Arguments provided in `args`
can change coloring of parts of message.
See [arguments](#arguments) section for more info.

![Basic title](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_title.PNG)

```javascript
 log.title("Hi, im peon-log module!", []);
```
```cmd
peon-log "Hi, im peon-log module!" -T title
```

#### `log.quote(status, message, args)`

Print quote text messages send in `message` param into console with coloring for quote. It based on `status` provided as
first parameter that is boolean. Arguments provided in `args`can change coloring of parts of message. 
See [arguments](#arguments) section for more info.

![Basic quote ok](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_quote_ok.PNG)
![Basic quote fail](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_quote_fail.PNG)

```javascript
 log.quote(true, "Hi, this is positive quote style!", []);
 log.quote(false, "Hi, this is negative quote style!", []);
```
```cmd
peon-log "Hi, this is positive quote style!" -T quote
peon-log "Hi, this is negative quote style!" -T quote -F
```
> As you can see. There is flag `-F` that is used for setting fail type of quote.

#### `log.assert(status, message, args)`

Print assert text messages send in `message` param into console with coloring for assert. It based on `status` provided as
first parameter that is boolean. Arguments provided in `args`can change coloring of parts of message. 
See [arguments](#arguments) section for more info.

![Basic assert ok](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_assert_ok.PNG)
![Basic assert fail](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_assert_fail.PNG)

```javascript
 log.assert(true, "Hi, this is positive assert style!", []);
 log.assert(false, "Hi, this is negative assert style!", []);
```
```cmd
peon-log "Hi, this is positive quote style!" -T assert
peon-log "Hi, this is negative quote style!" -T assert -F
```
> As you can see. There is flag `-F` that is used for setting fail type of assert.


#### `log.setting(name, message, args)`

Print setting text messages send in `message` param into console with coloring for assert. It is prefixed with `status`
name provided as first parameter that is string. Arguments provided in `args`can change coloring of parts of message. 
See [arguments](#arguments) section for more info.

![Basic setting](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_setting.PNG)

```javascript
 log.setting("log-level", "Set log level of logger.", []);
```
```cmd
peon-log -N log-level "Set log level of logger." -T setting -L all
```
> You must for log level type 'all' because normally message is not show due to default value of log-level.

#### `log.filename(message, args)`

Print filename text messages send in `message` param into console with coloring for assert. Arguments provided 
in `args`can change coloring of parts of message. 
See [arguments](#arguments) section for more info.

![Basic filename](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/basic_filename.PNG)

```javascript
 log.filename("Generated some file name into some folder.", []);
```
```cmd
peon-log "Generated some file name into some folder." -T filename -L all
```
> You must for log level type 'all' because normally message is not show due to default value of log-level.



#### Arguments

This section describe parameter `arguments` that is send into every function of logger. Arguments are special 
colorized piece of text and can be difference from type of message. 

For example you can colorize your url that is in you console message. As you can see below, you can use
$[1-N] to use is as a placeholder in message.

![Url argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_url.PNG)

```javascript
 log.log("This is a message with link $1!", [
 	log.p.url("https://github.com/peon-build/peon-log")
 ]);
```
```cmd
peon-log "This is a message with link $1!" --url https://github.com/peon-build/peon-log
```

![Urls argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_urls.PNG)

You can also use array of values, that are concat into string after.

```javascript
 log.log("This is a message with links $1!", [
 	log.p.url([
 		"https://github.com/peon-build/peon-log",
 		"https://github.com/peon-build/peon"
 	])
 ]);
```
```cmd
peon-log "This is a message with links $1!" --url https://github.com/peon-build/peon-log,https://github.com/peon-build/peon
```

#### `log.p.url(data)`

Create argument for displaying url link or links. 

![Url argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_url.PNG)

```javascript
 log.log("Link: $1", log.p.url("https://github.com/peon-build/peon"));
```
```cmd
peon-log "Link: $1" --url https://github.com/peon-build/peon
```

#### `log.p.path(data)`

Create argument for displaying path or paths. 

![Path argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_path.PNG)

```javascript
 log.log("Path: $1", log.p.path("C:/Test/file.js:325:10"));
```
```cmd
peon-log "Path: $1" --path C:/Test/file.js:325:10
```

#### `log.p.id(data)`

Create argument for displaying id or list of ids. 

![Id argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_id.PNG)

```javascript
 log.log("Id: $1", log.p.id("#Q25h48gtu89drt"));
```
```cmd
peon-log "Id: $1" --id #Q25h48gtu89drt
```

#### `log.p.number(data)`

Create argument for displaying number or list of numbers. 

![Number argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_numbers.PNG)

```javascript
 log.log("Numbers available: $1", log.p.number([1, 2, 20, 25, 30]));
```
```cmd
peon-log "Numbers available: $1" --number 1,2,20,25,30
```

#### `log.p.number(data)`

Create argument for displaying simple text. This is same like use ES6 templates or simple string concat.

![Text argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_text.PNG)

```javascript
 log.log("Text: $1", log.p.text("simple text"));
 log.log("Text: simple text");
```
```cmd
peon-log "Text: $1" --text "simple text"
peon-log "Text: simple text"
```

#### `log.p.underline(data)`

Create argument for displaying underline text.

![Underline argument](https://raw.githubusercontent.com/peon-build/peon-log/master/doc/imgs/arguments_underline.PNG)

```javascript
 log.log("Text: $1", log.p.underline("simple text"));
```
```cmd
peon-log "Text: $1" --underline "simple text"
```