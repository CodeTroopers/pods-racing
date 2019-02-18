import "date";
import Race from "dal/models/race";
import Races from "dal/sets/races";
import dataManager from "dal/dataManager";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// Add should on prototype
chai.should();

bdd.describe("Test races", () => {
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
		const races = new Races();
		const promise = Promise.all([race1.save(), race2.save(), race3.save(), race4.save()]).then(() => races.getActiveRaces());
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Race).and.include(expected);
	});
});