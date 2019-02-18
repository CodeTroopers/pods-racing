import DBSet from "dal/dbSet";
import EnvironmentObject from "dal/models/environmentObject";

class EnvironmentObjects extends DBSet {
	constructor() {
		super(EnvironmentObject);
	}
}

export default EnvironmentObjects;