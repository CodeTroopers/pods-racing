import Model from "dal/models/model";
import { Vector3 } from "three";

class EnvironmentObject extends Model {
	constructor(position) {
		super();
		this.position = position || new Vector3();
	}

	get position() {
		return this._position;
	}

	set position(value) {
		if (value.isVector3)
			this._position = value;
		else
			this._position = new Vector3(value.x, value.y, value.z);
	}
}

export default EnvironmentObject;