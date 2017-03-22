"use strict";

define(["intern!bdd", "chai", "chai-as-promised", "q", "configuration", "core/dataManager"], function (bdd, chai, chaiAsPromised, q, configuration, dataManager) {
	chai.use(chaiAsPromised);
	// add should on prototype
	var should = chai.should();
	// active test mode
	// TODO: set test to true to active couchebase mock and remove dataManager.removeAll
	configuration.test = false;
	var server = dataManager.options.server;
	var bucketName = dataManager.options.bucketName;

	bdd.describe("Test data manager", function () {
		bdd.before(function () {
			// executes before suite starts
			return dataManager.removeAll().fail(function (reason) {
				throw reason;
			});
		});

		bdd.after(function () {
			// executes after suite ends
			dataManager.removeAll().then(function () {
				dataManager.disconnect();
			}).fail(function (reason) {
				throw reason;
			});
		});

		bdd.beforeEach(function () {
			// executes before each test
		});

		bdd.afterEach(function () {
			// executes after each test
			// restore server name
			if (dataManager.options.server !== server) {
				dataManager.options.server = server;
				dataManager.disconnect();
			}
			// retore bucket name
			if (dataManager.options.bucketName !== bucketName) {
				dataManager.options.bucketName = bucketName;
				dataManager.disconnect();
			}
		});

		bdd.it("should failed if server is down", function () {
			var promise = dataManager.disconnect().then(function () {
				dataManager.options.server = "unexistingServer";
				return dataManager.get("SELECT * FROM $");
			});
			return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(21);
		});

		bdd.it("should failed if bucket doesn't exist", function () {
			var promise = dataManager.disconnect().then(function () {
				dataManager.options.bucketName = "test";
				return dataManager.get("SELECT * FROM $");
			});
			return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(2);
		});

		bdd.it("should failed if query is empty", function () {
			var promise = dataManager.get();
			return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(1050);
		});

		bdd.it("should failed if query is invalid", function () {
			var promise = dataManager.get("test");
			return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(3000);
		});

		bdd.it("should get data", function () {
			var promise = dataManager.get("SELECT * FROM $");
			return promise.should.fulfilled.and.eventually.be.an("array");
		});

		bdd.it("should get data with parameters", function () {
			var promise = dataManager.get("SELECT * FROM $ WHERE name =$1 AND type = $2", ["test", "User"]);
			return promise.should.fulfilled.and.eventually.be.an("array");
		});

		bdd.it("should save data", function () {
			var promise = dataManager.save({
				type: "User",
				name: "test"
			});
			return promise.should.fulfilled.and.eventually.be.ok;
		});

		bdd.it("should get data by id", function () {
			var promise = dataManager.save({
				type: "User",
				name: "test"
			}).then(function (id) {
				return dataManager.getById("User", id);
			});
			return promise.should.fulfilled.and.eventually.contain.all.keys({
				type: "User",
				name: "test"
			}).and.have.property("id").ok;
		});

		bdd.it("should save modified data", function () {
			var promise = dataManager.save({
				type: "User",
				name: "test"
			}).then(function (id) {
				return dataManager.getById("User", id).then(function (data) {
					data.name = "modified test";
					return dataManager.save(data).then(function (id) {
						return dataManager.getById("User", id);
					});
				});
			});
			return promise.should.fulfilled.and.eventually.have.property("name").equal("modified test");
		});

		bdd.it("should fail if type is not defined", function () {
			var promise = dataManager.save({
				name: "test"
			});
			return promise.should.be.rejectedWith(Error);
		});

		bdd.it("should remove all data", function () {
			var promise = dataManager.removeAll();
			return promise.should.fulfilled;
		});

		bdd.it("should wait initialization", function () {
			var promise = dataManager.disconnect().then(function () {
				return q.all([dataManager.get("SELECT * FROM $"), dataManager.get("SELECT * FROM $")]);
			});
			return promise.should.fulfilled;
		});
	});
});
