var cleanDirs = ["lib"];

var dependencies = [
    { name: "json2",
        repository : "thirdpartyrepo",
        source: "json2.zip",
        targets : [
            { name: "json2.js", path: "lib/test"}
        ]
    },
    { name: "jquery",
        repository : "thirdpartyrepo",
	version: "1.6.2/1.6.2.0",
        source: "jquery.zip",
        targets : [
            { name: "jquery-1.6.2.js", path: "lib/test"}
        ]
    },

    { name: "jssert",
        repository: "buildrepo2",
        source: "jssert.zip",
        targets: [
            {name: "jssert.js", path: "lib/test"}
        ]
    },

    { name: "javascriptcore",
        repository: "buildrepo2",
        source: "javascriptcore.zip",
        targets: [
            {name: "*.js", path: "lib/run"}
        ]
    }
];
