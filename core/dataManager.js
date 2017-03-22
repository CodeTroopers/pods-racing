define(["couchbase", "q", "uuid", "configuration"], function (couchbase, q, uuid, configuration) {
	var cluster, bucket;
	var options = {
		protocol: configuration.couchbase.protocol,
		server: configuration.couchbase.server,
		port: configuration.couchbase.port,
		bucketName: configuration.couchbase.bucketName
	};
	var initilizationPromise = null;

	function open() {
		return q.promise(function (resolve, reject) {
			bucket = cluster.openBucket(options.bucketName, function (error) {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	function createPrimaryIndex() {
		return q.promise(function (resolve, reject) {
			bucket.manager().createPrimaryIndex({
				ignoreIfExists: true
			}, function (error) {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	function disconnect() {
		if (initilizationPromise) {
			return initilizationPromise.then(function () {
				bucket.disconnect();
				initilizationPromise = null;
			});
		} else {
			return q.resolve();
		}
	}

	function init() {
		if (!initilizationPromise) {
			initilizationPromise = q.promise(function (resolve, reject) {
				if (configuration.test) {
					// Use couchbase mock for testing
					couchbase = couchbase.Mock;
				}
				cluster = new couchbase.Cluster(options.protocol + "://" + options.server + ":" + options.port);
				open().then(function () {
					return createPrimaryIndex();
				}).then(function () {
					resolve();
				}).fail(function (reason) {
					initilizationPromise = null;
					reject(reason);
				});
			});
		}
		return initilizationPromise;
	}

	function execute(executeCallback) {
		return init().then(function () {
			return q.promise(function (resolve, reject) {
				executeCallback(function (error, result) {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				});
			});
		});
	}

	function getCounterValue(counterName) {
		return execute(function (callback) {
			bucket.counter(counterName, 1, {
				initial: 1
			}, callback);
		}).then(function (result) {
			return result.value;
		});
	}

	function save(data) {
		// ensure type is defined
		if (!data.type) {
			return q.reject(new Error("The property \"type\" must be defined on the entity."));
		} else {
			return (data.id ? q.resolve(data.id) : getCounterValue(data.type + "Counter")).then(function (id) {
				// ensure id is not in data
				data.id = undefined;

				return execute(function (callback) {
					bucket.upsert(data.type + "::" + id, data, callback);
				}).then(function () {
					return id;
				});
			});
		}
	}

	function get(query, parameters) {
		if (query) {
			query = query.replace(/\s\$\s|\s\$$/g, " `" + options.bucketName + "` ");
		}
		return execute(function (callback) {
			bucket.query(couchbase.N1qlQuery.fromString(query), parameters, callback);
		});
	}

	function getById(type, id) {
		return execute(function (callback) {
			bucket.get(type + "::" + id, callback);
		}).then(function (result) {
			result.value.id = id;
			return result.value;
		});
	}

	function removeAll() {
		return execute(function (callback) {
			bucket.manager().flush(callback);
		});
	}

	return {
		options: options,
		get: get,
		getById: getById,
		save: save,
		disconnect: disconnect,
		removeAll: removeAll
	};
});
