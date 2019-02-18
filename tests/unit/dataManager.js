import dataManager from "dal/dataManager";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// add should on prototype
chai.should();

bdd.describe("Test data manager", () => {
	let server, bucketName, password;

	bdd.before(() => {
		// executes before suite starts
		server = dataManager.options.server;
		password = dataManager.options.password;
		bucketName = dataManager.options.bucketName;
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
		// restore server name
		if (dataManager.options.server !== server) {
			dataManager.options.server = server;
			dataManager.disconnect();
		}
		// restore password
		if (dataManager.options.password !== password) {
			dataManager.options.password = password;
			dataManager.disconnect();
		}
		// restore bucket name
		if (dataManager.options.bucketName !== bucketName) {
			dataManager.options.bucketName = bucketName;
			dataManager.disconnect();
		}
		// delete data
		return dataManager.removeAll();
	});

	bdd.it("should failed if server is down", () => {
		const promise = dataManager.disconnect().then(() => {
			dataManager.options.server = "nonexistingServer";
			return dataManager.get("SELECT * FROM $");
		});
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(21);
	});

	bdd.it("should failed if authentication is invalid", () => {
		const promise = dataManager.disconnect().then(() => {
			dataManager.options.password = "xxxxxxx";
			return dataManager.get("SELECT * FROM $");
		});
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(2);
	});

	bdd.it("should failed if bucket doesn't exist", () => {
		const promise = dataManager.disconnect().then(() => {
			dataManager.options.bucketName = "test";
			return dataManager.get("SELECT * FROM $");
		});
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(2);
	});

	bdd.it("should failed if query is empty", () => {
		const promise = dataManager.get();
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(1050);
	});

	bdd.it("should failed if query is invalid", () => {
		const promise = dataManager.get("test");
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("code").equal(3000);
	});

	bdd.it("should get data", () => {
		const promise = dataManager.get("SELECT * FROM $");
		return promise.should.be.fulfilled.and.eventually.be.an("array");
	});

	bdd.it("should get data with parameters", () => {
		const promise = dataManager.get("SELECT * FROM $ WHERE name =$1 AND type = $2", ["test", "User"]);
		return promise.should.be.fulfilled.and.eventually.be.an("array");
	});

	bdd.it("should save data", () => {
		const promise = dataManager.save({
			type: "User",
			name: "test"
		});
		return promise.should.be.fulfilled.and.eventually.be.ok;
	});

	bdd.it("should get data by id", () => {
		const promise = dataManager.save({
			type: "User",
			name: "test"
		}).then((id) => dataManager.getById(id));
		return promise.should.be.fulfilled.and.eventually.include({
			type: "User",
			name: "test"
		}).and.have.property("id").be.ok;
	});

	bdd.it("should save modified data", () => {
		const promise = dataManager.save({
			type: "User",
			name: "test"
		}).then((id) => {
			return dataManager.getById(id).then((data) => {
				data.name = "modified test";
				return dataManager.save(data).then((id) => dataManager.getById(id));
			});
		});
		return promise.should.be.fulfilled.and.eventually.have.property("name").equal("modified test");
	});

	bdd.it("should fail if type is not defined", () => {
		const promise = dataManager.save({
			name: "test"
		});
		return promise.should.be.rejectedWith(Error);
	});

	bdd.it("should save if type can be deduced", () => {
		class Test {
			constructor(name) {
				this.name = name;
			}
		}
		const promise = dataManager.save(new Test("test"));
		return promise.should.be.fulfilled.and.eventually.be.ok;
	});

	bdd.it("should remove all data", () => {
		const promise = dataManager.removeAll();
		return promise.should.be.fulfilled;
	});

	bdd.it("should wait initialization", () => {
		const promise = dataManager.disconnect().then(() => {
			return Promise.all([dataManager.get("SELECT * FROM $"), dataManager.get("SELECT * FROM $")]);
		});
		return promise.should.be.fulfilled;
	});

	bdd.it("should execute view", () => {
		const promise = dataManager.executeView("Race", "activeRaces");
		return promise.should.be.fulfilled;
	});

	bdd.it("should get data from view", () => {
		const promise = dataManager.save({
			type: "Model",
			name: "test"
		}).then(() => dataManager.executeView("Model", "Models"));
		return promise.should.be.fulfilled.and.eventually.be.an("array");
	});
});