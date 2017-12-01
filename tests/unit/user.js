import dataManager from "dataManager";
import { Races, Race } from "models/race";
import { Pod } from "models/pod";
import { EnvironmentObject } from "models/environmentObject";
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
		//return dataManager.removeAll();
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
		const pods = [{
			name: "pods1"
		}, {
			name: "pods2"
		}];
		const user = new User("user-with-pods");
		user.pods = pods;
		return user.save().then(() => {
			user.should.be.an.instanceof(User);
			user.should.have.property("id");
			user.should.have.property("pods").equal(pods);

			return user.getPods().then((result) => {
				result.should.be.an("array");

				let i = 0;
				for (const pod of result) {
					pod.should.be.an.instanceof(Pod);
					pod.should.have.property("name").equal(pods[i].name);
					pod.should.have.property("userId").equal(user.id);
					i++;
				}
			});
		});
	});
});
