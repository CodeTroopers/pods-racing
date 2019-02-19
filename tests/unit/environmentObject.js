import dataManager from "dal/dataManager";
import DBContext from "dal/dbContext";
import EnvironmentObject from "dal/models/environmentObject";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// add should on prototype
chai.should();

bdd.describe("Test environment object", () => {
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

	bdd.it("should create an environment object", () => {
		const expected = {
			position: {
				x: 123,
				y: 456,
				z: 789
			}
		};
		const environmentObject = new EnvironmentObject(expected.position);
		const promise = environmentObject.save().then(() => {
			environmentObject.should.be.an.instanceof(EnvironmentObject);
			environmentObject.should.have.property("id").ok;
			environmentObject.should.have.deep.property("position").equal(expected.position);
		});
		return promise.should.be.fulfilled;
	});

	bdd.it("should update an environment object", () => {
		const expected = {
			id: null,
			position: {
				x: 123,
				y: 456,
				z: 789
			}
		};
		const environmentObject = new EnvironmentObject();
		const promise = environmentObject.save().then(() => {
			expected.id = environmentObject.id;
			environmentObject.position = expected.position;
			return environmentObject.save().then(() => DBContext.EnvironmentObjects.getById(environmentObject.id));
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(EnvironmentObject).and.deep.include(expected);
	});
});