// Application configuration file
define({
	// configuration for the couch base
	couchbase: {
		// protocol to use : couchbase, http or https
		protocol: "couchbase",
		// server name
		server: "localhost",
		// port
		port: "8091",
		// bucket name
		bucketName: "pods-racing"
	},
	// set to true to define test mode
	test: false
});
