// Learn more about configuring this file at <https://theintern.github.io/intern/#configuration>.
// These default settings work OK for most people. The options that *must* be changed below are the packages, suites,
// excludeInstrumentation, and (if you want functional tests) functionalSuites
define({

	loaders: {
		"host-node": "requirejs"
	},

	// Unit test suite(s) to run in each browser
	//suites: ["tests/unit/dataManager", "tests/unit/user"],
	suites: ["tests/unit/race"],

	// Functional test suite(s) to execute against each browser once unit tests are completed
	functionalSuites: [ /* "myPackage/tests/functional" */ ],

	// A regular expression matching URLs to files that should not be included in code coverage analysis. Set to `true`
	// to completely disable code coverage.
	excludeInstrumentation: /^(?:tests|node_modules)\//,

	// A list of reporters
	reporters: [{
		id: 'Console',
		watermarks: {
			statements: [70, 95],
			lines: [70, 95],
			functions: [70, 95],
			branches: [70, 95]
		}
	}, {
		id: 'LcovHtml',
		watermarks: {
			statements: [70, 95],
			lines: [70, 95],
			functions: [70, 95],
			branches: [70, 95]
		}
	}]
});
