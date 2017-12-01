import { Models, Model } from "models/model";

class EnvironmentObject extends Model {
	constructor(position) {
		super();
		this.position = position || {
			x: 0,
			y: 0,
			z: 0
		};
	}

	static get(id) {
		return super.get(id, EnvironmentObject);
	}
}

class EnvironmentObjects extends Models {
	static get(query, ...parameters) {
		return super.get(query, parameters, EnvironmentObject);
	}
}

export { EnvironmentObjects, EnvironmentObject };