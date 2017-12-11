import dataManager from "dataManager";
import { Races, Race } from "models/race";
import { Pod } from "models/pod";
import { EnvironmentObject } from "models/environmentObject";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "date";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// add should on prototype
chai.should();

bdd.describe("Test race", () => {
	bdd.before(() => {
		// executes before suite starts
	});

	bdd.after(() => {
		// executes after suite ends
		return dataManager.disconnect();
	});

	bdd.beforeEach(() => {
		// executes before each test
	});

	bdd.afterEach(() => {
		// executes after each test
		return dataManager.removeAll();
	});

	bdd.it("should create a race", () => {
		const race = new Race("new race");
		const promise = race.save().then(() => {
			race.should.be.an.instanceof(Race);
			race.should.have.property("id").ok;
			race.should.have.property("name").equal("new race");
		});
		return promise.should.be.fulfilled;
	});

	bdd.it("should get a race", () => {
		const expected = {
			id: null,
			name: "new race"
		};
		const race = new Race(expected.name);
		const promise = race.save().then(() => {
			expected.id = race.id;
			return Race.get(expected.id);
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Race).and.include(expected);
	});

	bdd.it("should update a race", () => {
		const expected = {
			id: null,
			name: "modified race"
		};
		const race = new Race("original race");
		const promise = race.save().then(() => {
			expected.id = race.id;
			race.name = expected.name;
			return race.save().then(() => {
				return Race.get(race.id);
			});
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Race).and.include(expected);
	});

	bdd.it("should get races", () => {
		const promise = Races.get();
		return promise.should.be.fulfilled.and.eventually.be.an("array");
	});

	bdd.it("should get active races", () => {
		const expected = {
			name: "active race"
		};
		const race1 = new Race(expected.name);
		race1.startDate = new Date().subtractDays(1);
		race1.endDate = new Date().addDays(1);
		const race2 = new Race("no started race");
		race2.startDate = new Date().addDays(1);
		const race3 = new Race("finished race");
		race3.endDate = new Date().subtractDays(1);
		const race4 = new Race("finished race with start date");
		race4.startDate = new Date().subtractDays(2);
		race4.endDate = new Date().subtractDays(1);
		const promise = Promise.all([race1.save(), race2.save(), race3.save(), race4.save()]).then(() => Races.getActiveRaces());
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Race).and.include(expected);
	});

	bdd.it("should get pods of a race", () => {
		const race1 = new Race("race1");
		race1.startDate = new Date().subtractDays(1);
		race1.endDate = new Date().addDays(1);
		const race2 = new Race("race2");
		race2.startDate = new Date().subtractDays(1);
		race2.endDate = new Date().addDays(1);
		const promise = Promise.all([race1.save(), race2.save()]).then(() => {
			const pod1 = new Pod("pod1");
			pod1.positions = [{
				raceId: race2.id,
				x: 0,
				y: 0,
				z: 0
			}];
			const pod2 = new Pod("pod2");
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
			return Promise.all([pod1.save(), pod2.save()]).then(() => race1.getPods());
		});
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Pod).with.property("name").equal("pod2");
	});

	bdd.it("should get environment objects of a race", () => {
		const race1 = new Race("race1");
		race1.startDate = new Date().subtractDays(1);
		race1.endDate = new Date().addDays(1);
		const race2 = new Race("race2");
		race2.startDate = new Date().subtractDays(1);
		race2.endDate = new Date().addDays(1);
		const promise = Promise.all([race1.save(), race2.save()]).then(() => {
			const environmentObject1 = new EnvironmentObject();
			environmentObject1.raceId = race1.id;
			const environmentObject2 = new EnvironmentObject();
			environmentObject2.raceId = race2.id;
			return Promise.all([environmentObject1.save(), environmentObject2.save()]).then(() => race1.getEnvironmentObjects());
		});
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(EnvironmentObject).with.property("position");
	});
});