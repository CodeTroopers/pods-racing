import dataManager from "dataManager";
import { Users, User } from "models/user";
import { Pod } from "models/pod";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "date";

const bdd = global.intern.getInterface("bdd");

chai.use(chaiAsPromised);
// add should on prototype
chai.should();

bdd.describe("Test user", () => {
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

	bdd.it("should create a user", () => {
		const user = new User("new user");
		const promise = user.save().then(() => {
			user.should.be.an.instanceof(User);
			user.should.have.property("id").ok;
			user.should.have.property("name").equal("new user");
		});
		return promise.should.be.fulfilled;
	});

	bdd.it("should get a user", () => {
		const expected = {
			id: null,
			name: "new user"
		};
		const user = new User(expected.name);
		const promise = user.save().then(() => {
			expected.id = user.id;
			return User.get(expected.id);
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(User).and.include(expected);
	});

	bdd.it("should get a user by name", () => {
		const expected = {
			id: null,
			name: "new user"
		};
		const user = new User(expected.name);
		const promise = user.save().then(() => {
			expected.id = user.id;
			return User.getByName(expected.name);
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(User).and.include(expected);
	});

	bdd.it("should fail when getting a user with name which does not exist", () => {
		const promise = User.getByName("test");
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("message").equal("User with name \"test\" doesn't exist");
	});

	bdd.it("should fail when getting a user with name on several users", () => {
		const user1 = new User("test");
		const user2 = new User("test");
		const promise = Promise.all([user1.save(), user2.save()]).then(() => User.getByName("test"));
		return promise.should.be.rejectedWith(Error).and.eventually.have.property("message").equal("There are several users with name \"test\"");
	});

	bdd.it("should update a user", () => {
		const expected = {
			id: null,
			name: "modified user"
		};
		const user = new User("original user");
		const promise = user.save().then(() => {
			expected.id = user.id;
			user.name = expected.name;
			return user.save().then(() => {
				return User.get(user.id);
			});
		});
		return promise.should.be.fulfilled.and.eventually.be.an.instanceof(User).and.include(expected);
	});

	bdd.it("should create a user with pods", () => {
		const expected = {
			name: "pod of user"
		};
		const user = new User("user with pods");
		const promise = user.save().then(() => {
			expected.userId = user.id;
			const pod = new Pod(expected.name);
			pod.userId = user.id;
			return pod.save().then(() => {
				expected.id = pod.id;
				return user.getPods();
			});
		});
		return promise.should.be.fulfilled.and.eventually.be.an("array").have.lengthOf(1).with.deep.property("0").instanceof(Pod).and.include(expected);
	});

	bdd.it("should get users", () => {
		const promise = Users.get();
		return promise.should.be.fulfilled.and.eventually.be.an("array");
	});
});
