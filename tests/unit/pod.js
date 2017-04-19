"use strict";

define(["intern!bdd", "chai", "chai-as-promised", "configuration", "core/dataManager", "core/models/pod"], function (bdd, chai, chaiAsPromised, configuration, dataManager, Pod) {
	chai.use(chaiAsPromised);
	// add should on prototype
	var should = chai.should();
	// active test mode
	// TODO: set test to true to active couchebase mock and remove dataManager.removeAll
	configuration.test = false;

	bdd.describe("Test pod", function () {
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
		});

		bdd.it("should create a pod", function () {
			var pod = new Pod("test");
			var promise = pod.save().then(function () {
				pod.should.be.an.instanceof(Pod);
				pod.should.have.property("id").ok;
				pod.should.have.property("name").equal("test");
			});
			return promise.should.fulfilled;
		});

		bdd.it("should get a pod", function () {
			var expected = {
				id: null,
				name: "test"
			};
			var pod = new Pod(expected.name);
			var promise = pod.save().then(function () {
				expected.id = pod.id;
				return Pod.get(expected.id);
			});
			return promise.should.fulfilled.and.eventually.be.an.instanceof(Pod).and.include(expected);
		});

		bdd.it("should update a pod", function () {
			var expected = {
				id: null,
				name: "modified test"
			};
			var pod = new Pod("original test");
			var promise = pod.save().then(function () {
				expected.id = pod.id;
				pod.name = expected.name;
				return pod.save().then(function () {
					return Pod.get(pod.id);
				});
			});
			return promise.should.fulfilled.and.eventually.be.an.instanceof(Pod).and.include(expected);
		});
	});
});
