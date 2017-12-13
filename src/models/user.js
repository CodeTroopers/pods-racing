import { Models, Model } from "models/model";
import { Pods } from "models/pod";

class User extends Model {
	constructor(name) {
		super();
		this.name = name;
	}

	getPods() {
		return Pods.get("userId = $1 ORDER BY name", this.id);
	}

	static get(id) {
		return super.get(id, User);
	}

	static getByName(name) {
		return Users.get("name = $1", name).then((users) => {
			if (users.length == 0)
				throw new Error(`User with name "${name}" doesn't exist`);
			if (users.length > 1)
				throw new Error(`There are several users with name "${name}"`);
			return users[0];
		});
	}
}

class Users extends Models {
	static get(query, ...parameters) {
		return super.get(query, parameters, User);
	}
}

export { Users, User };