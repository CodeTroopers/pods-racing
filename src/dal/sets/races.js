import DBSet from "dal/dbSet";
import Race from "dal/models/race";

class Races extends DBSet {
	constructor() {
		super(Race);
	}

	getActiveRaces() {
		return super.getFromView("activeRaces");
	}
}

export default Races;