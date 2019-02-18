import dataManager from "dal/dataManager";
import DBContext from "dal/dbContext";
import Model from "dal/models/model";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// add should on prototype
chai.should();

bdd.describe("Test model", () => {
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

	bdd.it("should create a model", () => {
		const model = new Model();
		const promise = model.save().then(() => {
			model.should.be.an.instanceof(Model);
			model.should.have.property("id").ok;
		});
		return promise.should.be.fulfilled;
	});

	bdd.it("should update a model", () => {
		const expected = {
			id: null,
			name: "test update model"
		};
		const model = new Model();
		const promise = model.save().then(() => {
			expected.id = model.id;
			model.name = expected.name;
			return model.save().then(() => DBContext.Models.getById(model.id));
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Model).and.include(expected);
	});
});