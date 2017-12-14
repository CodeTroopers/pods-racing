import dotenv from "dotenv";
// Load environment variables
dotenv.config();

// Application configuration file
let configuration = {
	// configuration for the couch base
	couchbase: {
		// protocol to use : couchbase, http or https
		protocol: "couchbase",
		// server name
		server: "localhost",
		// port
		port: "8091",
		// user name
		userName: process.env.login,
		// password
		password: process.env.password,
		// bucket name
		bucketName: "pods-racing"
	},
	// set to true to define test mode
	test: false
};

export { configuration };