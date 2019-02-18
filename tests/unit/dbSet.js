import dataManager from "dal/dataManager";
import DBSet from "dal/dbSet";
import Model from "dal/models/model";
import Pod from "dal/models/pod";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// add should on prototype
chai.should();

bdd.describe("Test dbSet", () => {
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

	bdd.it("should create a dbSet of Model", () => {
		const dbSet = new DBSet(Model);
		dbSet.type.should.be.equal(Model);
	});

	bdd.it("should create a dbSet of inherited Model", () => {
		const dbSet = new DBSet(Pod);
		dbSet.type.should.be.equal(Pod);
	});

	bdd.it("should throw error when creating a dbSet of invalid type", () => {
		(function() {
			new DBSet(Date);
		}).should.throw(Error, "Date must inherit from Model");
	});

	bdd.it("should get item of dbSet by its id", () => {
		const expected = {
			id: null,
			name: "test get item by id"
		};
		const model = new Model();
		model.name = expected.name;
		const dbSet = new DBSet(Model);
		const promise = model.save().then(() => {
			expected.id = model.id;
			return dbSet.getById(expected.id);
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Model).and.include(expected);
	});

	bdd.it("should get items of dbSet", () => {
		const expected = {
			id: null,
			name: "test get items"
		};
		const model = new Model();
		model.name = expected.name;
		const dbSet = new DBSet(Model);
		const promise = model.save().then(() => dbSet.get());
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Model).with.property("name").equal(expected.name);
	});

	bdd.it("should get items of dbSet with query", () => {
		const expected = {
			id: null,
			name: "test get items with query"
		};
		const model = new Model();
		model.name = expected.name;
		const dbSet = new DBSet(Model);
		const promise = model.save().then(() => dbSet.get("name = $1", expected.name));
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Model).with.property("name").equal(expected.name);
	});

	bdd.it("should get items of dbSet from view", () => {
		const expected = {
			id: null,
			name: "test get items from view"
		};
		const model = new Model();
		model.name = expected.name;
		const dbSet = new DBSet(Model);
		const promise = model.save().then(() => dbSet.getFromView("Models"));
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Model).with.property("name").equal(expected.name);
	});
});