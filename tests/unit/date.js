import "date";
import chai from "chai";

const bdd = global.intern.getInterface("bdd");

// add should on prototype
chai.should();

bdd.describe("Test date", () => {
	bdd.before(() => {
		// executes before suite starts
	});

	bdd.after(() => {
		// executes after suite ends
	});

	bdd.beforeEach(() => {
		// executes before each test
	});

	bdd.afterEach(() => {
		// executes after each test
	});

	bdd.it("should add days to a date", () => {
		const date = (new Date()).addDays(3);
		date.should.be.a("Date");
	});

	bdd.it("should subtract days to a date", () => {
		const date = (new Date()).subtractDays(3);
		date.should.be.a("Date");
	});
});