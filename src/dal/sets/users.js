import DBSet from "dal/dbSet";
import User from "dal/models/user";

class Users extends DBSet {
	constructor() {
		super(User);
	}

	getByName(name) {
		return this.get("name = $1", name).then((users) => {
			if (users.length == 0)
				throw new Error(`User with name "${name}" doesn't exist`);
			if (users.length > 1)
				throw new Error(`There are several users with name "${name}"`);
			return users[0];
		});
	}
}

export default Users;