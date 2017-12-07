import couchbase from "couchbase";
import { configuration } from "configuration";
import { promisify } from "helper";
import design from "design";

global.intern.on("beforeRun", function () {
	const cluster = new couchbase.Cluster(configuration.couchbase.protocol + "://" + configuration.couchbase.server + ":" + configuration.couchbase.port);
	const clusterManager = cluster.manager(configuration.couchbase.userName, configuration.couchbase.password);
	let bucket;

	function createBucket() {
		return promisify((callback) => {
			clusterManager.createBucket(configuration.couchbase.bucketName, {
				replicaNumber: 0
			}, callback);
		});
	}

	function authenticate() {
		return promisify((callback) => {
			try {
				cluster.authenticate(configuration.couchbase.userName, configuration.couchbase.password);
				callback();
			}
			catch (error) {
				callback(error);
			}
		});
	}

	function open() {
		return promisify((callback) => {
			bucket = cluster.openBucket(configuration.couchbase.bucketName, callback);
		});
	}

	function createPrimaryIndex() {
		return promisify((callback) => {
			bucket.manager().createPrimaryIndex({
				name: "default",
				ignoreIfExists: true
			}, callback);
		});
	}

	function createViews() {
		const bucketManager = bucket.manager();
		const promises = [];
		for (const designDocument of design) {
			promises.push(promisify((callback) => {
				bucketManager.upsertDesignDocument(designDocument.name, designDocument, callback);
			}));
		}
		return Promise.all(promises);
	}

	function disconnect() {
		return promisify((callback) => {
			bucket.disconnect();
			callback();
		});
	}

	// active test mode
	// TODO: set test to true to active couchbase mock and remove dataManager.removeAll
	configuration.test = false;

	configuration.couchbase.bucketName += "-test";
	return authenticate().then(() => {
		console.log("authenticated");
		return open().catch((error) => {
			console.log(error.message);
			return createBucket().then(() => {
				console.log("bucket created");
				return disconnect().then(()=> {
					console.log("disconnected");
					return authenticate().then(() => {
						console.log("authenticated");
						return open();
					});
				});
			});
		});
	})
		.then(() => {
			console.log("opened");
			return createPrimaryIndex();
		})
		.then(() => {
			console.log("index created");
			return createViews();
		}).then(() => {
			console.log("views created");
			return disconnect();
		});
});