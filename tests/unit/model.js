import dataManager from "dataManager";
import { Models, Model } from "models/model";
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

	bdd.it("should get a model", () => {
		const expected = {
			id: null
		};
		const model = new Model();
		const promise = model.save().then(() => {
			expected.id = model.id;
			return Model.get(expected.id);
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Model).and.include(expected);
	});

	bdd.it("should get a model with invalid type", () => {
		const promise = Model.get(1, Date);
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("message").equal("Date must inherit from Model");
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
			return model.save().then(() => Model.get(model.id));
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Model).and.include(expected);
	});

	bdd.it("should get models", () => {
		const expected = {
			id: null,
			name: "test get models"
		};
		const model = new Model();
		model.name = expected.name;
		const promise = model.save().then(() => Models.get("name = $1", expected.name));
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Model).with.property("name").equal(expected.name);
	});

	bdd.it("should get models with invalid type", () => {
		const promise = Models.get("name = $1", "test", Date);
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("message").equal("Date must inherit from Model");
	});

	bdd.it("should get models from view", () => {
		const expected = {
			id: null,
			name: "test get models from view"
		};
		const model = new Model();
		model.name = expected.name;
		const promise = model.save().then(() => Models.getFromView("Models"));
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Model).with.property("name").equal(expected.name);
	});

	bdd.it("should get models from view with invalid type", () => {
		const promise = Models.getFromView("Models", Date);
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("message").equal("Date must inherit from Model");
	});
});