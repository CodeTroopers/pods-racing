import { Models, Model } from "models/model";
import { Pods } from "models/pod";
import { EnvironmentObjects } from  "models/environmentObject";

class Race extends Model {
	constructor(name) {
		super();
		this.name = name;
	}

	getPods() {
		return Pods.get("ANY position IN positions SATISFIES position.raceId = $1 END", this.id);
	}

	getEnvironmentObjects() {
		return EnvironmentObjects.get("raceId = $1", this.id);
	}

	static get(id) {
		return super.get(id, Race);
	}
}

class Races extends Models {
	static get(query, ...parameters) {
		return super.get(query, parameters, Race);
	}

	static getActiveRaces() {
		return super.getFromView("activeRaces", Race);
	}
}

export { Races, Race };