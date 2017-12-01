import { Models, Model } from "models/model";

class Pod extends Model {
	constructor(name) {
		super();
		this.name = name;
		this.positions = [];
	}

	static get(id) {
		return super.get(id, Pod);
	}
}

class Pods extends Models {
	static get(query, ...parameters) {
		return super.get(query, parameters, Pod);
	}
}

export { Pods, Pod };