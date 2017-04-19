"use strict";

define(["intern!bdd", "chai", "chai-as-promised", "q", "core/date", "configuration", "core/dataManager", "core/models/race", "core/models/pod", "core/models/environmentObject"], function (bdd, chai, chaiAsPromised, q, date, configuration, dataManager, Race, Pod, EnvironmentObject) {
	chai.use(chaiAsPromised);
	// add should on prototype
	var should = chai.should();
	// active test mode
	// TODO: set test to true to active couchebase mock and remove dataManager.removeAll
	configuration.test = false;

	bdd.describe("Test race", function () {
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

		bdd.it("should create a race", function () {
			var race = new Race("new race");
			var promise = race.save().then(function () {
				race.should.be.an.instanceof(Race);
				race.should.have.property("id").ok;
				race.should.have.property("name").equal("new race");
			});
			return promise.should.fulfilled;
		});

		bdd.it("should get a race", function () {
			var expected = {
				id: null,
				name: "new race"
			};
			var race = new Race(expected.name);
			var promise = race.save().then(function () {
				expected.id = race.id;
				return Race.get(expected.id);
			});
			return promise.should.fulfilled.and.eventually.be.an.instanceof(Race).and.include(expected);
		});

		bdd.it("should update a race", function () {
			var expected = {
				id: null,
				name: "modified race"
			};
			var race = new Race("original race");
			var promise = race.save().then(function () {
				expected.id = race.id;
				race.name = expected.name;
				return race.save().then(function () {
					return Race.get(race.id);
				});
			});
			return promise.should.fulfilled.and.eventually.be.an.instanceof(Race).and.include(expected);
		});

		bdd.it("should get active races", function () {
			var race = new Race("active race");
			race.startDate = new Date().subtractDays(1);
			race.endDate = new Date().addDays(1);
			race.save();
			race = new Race("no started race");
			race.startDate = new Date().addDays(1);
			race.save();
			race = new Race("finished race");
			race.endDate = new Date().subtractDays(1);
			race.save();
			race = new Race("finished race with start date");
			race.startDate = new Date().subtractDays(2);
			race.endDate = new Date().subtractDays(1);
			race.save();
			var promise = Race.getActiveRaces();
			return promise.should.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("[0]").instanceof(Race);
		});

		bdd.it("should get pods of a race", function () {
			var race1 = new Race("race1");
			race1.startDate = new Date().subtractDays(1);
			race1.endDate = new Date().addDays(1);
			var race2 = new Race("race2");
			race2.startDate = new Date().subtractDays(1);
			race2.endDate = new Date().addDays(1);
			var promise = q.all([race1.save(), race2.save()]).then(function () {
				var pod1 = new Pod("pod1");
				pod1.positions = [{
					raceId: race2.id,
					x: 0,
					y: 0,
					z: 0
				}];
				var pod2 = new Pod("pod2");
				pod2.positions = [{
					raceId: race1.id,
					x: 0,
					y: 0,
					z: 0
				}, {
					raceId: race2.id,
					x: 0,
					y: 0,
					z: 0
				}];
				return q.all([pod1.save(), pod2.save()]).then(function () {
					return race1.getPods();
				});
			});
			return promise.should.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("[0]").instanceof(Pod).with.property("name").equal("pod2");
		});

		bdd.it("should get environment objects of a race", function () {
			var race1 = new Race("race1");
			race1.startDate = new Date().subtractDays(1);
			race1.endDate = new Date().addDays(1);
			var race2 = new Race("race2");
			race2.startDate = new Date().subtractDays(1);
			race2.endDate = new Date().addDays(1);
			var promise = q.all([race1.save(), race2.save()]).then(function () {
				var environmentObject1 = new EnvironmentObject();
				environmentObject1.raceId = race1.id;
				var environmentObject2 = new EnvironmentObject();
				environmentObject2.raceId = race2.id;
				return q.all([environmentObject1.save(), environmentObject2.save()]).then(function () {
					return race1.getEnvironmentObjects();
				});
			});
			return promise.should.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("[0]").instanceof(EnvironmentObject).with.property("position");
		});
	});
});
