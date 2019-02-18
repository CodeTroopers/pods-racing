import DBContext from "dal/dbContext";
import Model from "dal/models/model";

class User extends Model {
	constructor(name) {
		super();
		this.name = name;
	}

	getPods() {
		return DBContext.Pods.get("userId = $1 ORDER BY name", this.id);
	}
}

export default User;