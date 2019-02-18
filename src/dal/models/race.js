import DBContext from "dal/dbContext";
import Model from "dal/models/model";
import { Vector3 } from "three";

class Race extends Model {
	constructor(name) {
		super();
		this.name = name;
		this.startPosition = new Vector3();
		this.endPosition = new Vector3();
	}

	getPods() {
		return DBContext.Pods.get("raceId = $1", this.id);
	}

	getEnvironmentObjects() {
		return DBContext.EnvironmentObjects.get("raceId = $1", this.id);
	}
}

export default Race;