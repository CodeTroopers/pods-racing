import DBSet from "dal/dbSet";
import Model from "dal/models/model";

class Models extends DBSet {
	constructor() {
		super(Model);
	}
}

export default Models;