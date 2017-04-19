"use strict";

define(["intern!bdd", "chai", "chai-as-promised", "configuration", "core/dataManager", "core/models/user"], function (bdd, chai, chaiAsPromised, configuration, dataManager, User) {
	chai.use(chaiAsPromised);
	// add should on prototype
	var should = chai.should();
	// active test mode
	// TODO: set test to true to active couchebase mock and remove dataManager.removeAll
	configuration.test = false;

	bdd.describe("Test user", function () {
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

		bdd.it("should create a user", function () {
			var user = new User("new user");
			var promise = user.save().then(function () {
				user.should.be.an.instanceof(User);
				user.should.have.property("id").ok;
				user.should.have.property("name").equal("new user");
			});
			return promise.should.fulfilled;
		});

		bdd.it("should get a user", function () {
			var expected = {
				id: null,
				name: "new user"
			};
			var user = new User(expected.name);
			var promise = user.save().then(function () {
				expected.id = user.id;
				return User.get(expected.id);
			});
			return promise.should.fulfilled.and.eventually.be.an.instanceof(User).and.include(expected);
		});

		bdd.it("should update a user", function () {
			var expected = {
				id: null,
				name: "modified user"
			};
			var user = new User("original user");
			var promise = user.save().then(function () {
				expected.id = user.id;
				user.name = expected.name;
				return user.save().then(function () {
					return User.get(user.id);
				});
			});
			return promise.should.fulfilled.and.eventually.be.an.instanceof(User).and.include(expected);
		});

		bdd.it("should create a user with pods", function () {
			var pods = [{
				name: "pods1"
			}, {
				name: "pods2"
			}];
			var user = new User("user-with-pods");
			user.pods = pods;
			return user.save().then(function () {
				user.should.be.an.instanceof(User);
				user.should.have.property("id");
				user.should.have.property("pods").equal(pods);

				return user.getPods().then(function (result) {
					result.should.be.an("array");

					var i = 0;
					for (var pod of result) {
						pod.should.be.an.instanceof(Pod);
						pod.should.have.property("name").equal(pods[i].name);
						pod.should.have.property("userId").equal(user.id);
						i++;
					}
				});
			});
		});
	});
});
