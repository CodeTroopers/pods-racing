import couchbase from "couchbase";
import { configuration } from "configuration";
import { promisify } from "helper";

let couchbaseWrapper, cluster, bucket;
const options = configuration.couchbase;
let initializationPromise = null;

function authenticate() {
	return promisify((callback) => {
		try {
			cluster.authenticate(options.userName, options.password);
			callback();
		}
		catch(error)
		{
			callback(error);
		}
	});
}

function open() {
	return promisify((callback) => {
		bucket = cluster.openBucket(options.bucketName, callback);
	});
}

function init() {
	if(!initializationPromise) {
		initializationPromise = new Promise((resolve, reject) => {
			if (!couchbaseWrapper) {
				if(configuration.test) {
					// Use couchbase mock for testing
					couchbaseWrapper = couchbase.Mock;
				} else {
					couchbaseWrapper = couchbase;
				}
			}
			cluster = new couchbaseWrapper.Cluster(options.protocol + "://" + options.server + ":" + options.port);
			authenticate()
				.then(() => open())
				.then(() => resolve())
				.catch((reason) => {
					initializationPromise = null;
					return reject(reason);
				});
		});
	}
	return initializationPromise;
}

function execute(executeCallback) {
	return init().then(() => {
		return promisify(executeCallback);
	});
}

function getCounterValue(counterName) {
	return execute((callback) => {
		bucket.counter(counterName, 1, {
			initial: 1
		}, callback);
	}).then((result) => result.value);
}

function toN1qlQuery(query) {
	if (query) {
		query = query.replace(/\s\$\s|\s\$$/g, " `" + options.bucketName + "` ");
	}

	return couchbaseWrapper.N1qlQuery.fromString(query).consistency(couchbase.N1qlQuery.Consistency.REQUEST_PLUS);
}

export default {
	options,

	disconnect() {
		if (initializationPromise) {
			return initializationPromise.then(() => {
				bucket.disconnect();
				initializationPromise = null;
			});
		} else {
			return Promise.resolve();
		}
	},

	save(data) {
		// ensure type is defined
		if (!data.type) {
			data.type = data.constructor.name;
			if (!data.type || data.type === "Object") {
				return Promise.reject(new Error("The property \"type\" must be defined on the entity."));
			}
		}

		return (data.id ? Promise.resolve(data.id) : getCounterValue(data.type + "Counter")).then((id) => {
			// ensure id is not in data
			data.id = undefined;

			return execute((callback) => {
				bucket.upsert(data.type + "::" + id, data, callback);
			}).then(() => {
				return id;
			});
		});
	},

	get(query, parameters) {
		if(!(parameters instanceof Array))
			parameters = [parameters];

		return execute((callback) => {
			bucket.query(toN1qlQuery(query), parameters, callback);
		});
	},

	getById(type, id) {
		return execute((callback) => {
			bucket.get(type + "::" + id, callback);
		}).then((result) => {
			result.value.id = id;
			return result.value;
		});
	},

	executeView(type, viewName) {
		return execute((callback) => {
			bucket.query(couchbaseWrapper.ViewQuery.from(type, viewName).stale(couchbaseWrapper.ViewQuery.Update.BEFORE), callback);
		}).then((rows) => {
			return rows.map(row => {
				row.value.id = row.id;
				return row.value;
			});
		});
	},

	removeAll() {
		return execute((callback) => {
			bucket.query(toN1qlQuery("DELETE FROM $"), callback);
		});
	}
};