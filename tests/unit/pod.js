import dataManager from "dal/dataManager";Manager from "dataManager";
import DBContext from "dal/dbContext";
import Pod from "dal/models/pod";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// add should on prototype
chai.should();

bdd.describe("Test pod", () => {
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

	bdd.it("should create a pod", () => {
		const pod = new Pod("test");
		const promise = pod.save().then(() => {
			pod.should.be.an.instanceof(Pod);
			pod.should.have.property("id").ok;
			pod.should.have.property("name").equal("test");
		});
		return promise.should.be.fulfilled;
	});

	bdd.it("should update a pod", () => {
		const expected = {
			id: null,
			name: "modified test"
		};
		const pod = new Pod("original test");
		const promise = pod.save().then(() => {
			expected.id = pod.id;
			pod.name = expected.name;
			return pod.save().then(() => DBContext.Pods.getById(pod.id));
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(Pod).and.include(expected);
	});
});