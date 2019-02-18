import "date";
import DBContext from "dal/dbContext";
import Race from "dal/models/race";
import dataManager from "dal/dataManager";
import EnvironmentObject from "dal/models/environmentObject";
import Pod from "dal/models/pod";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// Add should on prototype
chai.should();

bdd.describe("Test race", () => {
	bdd.before(() => {
		// Executes before suite starts
	});

	bdd.after(() => {
		// Executes after suite ends
		return dataManager.disconnect();
	});

	bdd.beforeEach(() => {
		// Executes before each test
	});

	bdd.afterEach(() => {
		// Executes after each test
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
				return DBContext.Races.getById(race.id);
			});
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Race).and.include(expected);
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
			pod1.raceId = race2.id;
			const pod2 = new Pod("pod2");
			pod2.raceId = race1.id;
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