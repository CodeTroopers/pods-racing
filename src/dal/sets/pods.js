import DBSet from "dal/dbSet";
import Pod from "dal/models/pod";

class Pods extends DBSet {
	constructor() {
		super(Pod);
	}
}

export default Pods;