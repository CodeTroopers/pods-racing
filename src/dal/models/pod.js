import Model from "dal/models/model";
import Engine from "engine";
import Tank from "tank";
import { computeAccelerationVector } from "gravity";
import { Vector3 } from "three";

class Pod extends Model {
	constructor(name) {
		super();
		this.name = name;
		this.mass = 1500;
		this._engine = new Engine();
		this.tank = new Tank();
		this._position = new Vector3();
		this.velocity = new Vector3();
		this.cape = new Vector3();
	}

	get position() {
		return this._position;
	}

	set position(value) {
		if (value instanceof Vector3)
			this._position = value;
		else
			this._position = Object.assign(new Vector3(), value);
	}

	get engine() {
		return this._engine;
	}

	set engine(value) {
		if(value instanceof Engine)
			this._engine = value;
		else
			this._engine = Object.assign(new Engine(), value);
	}

	computeVelocity(objects, time) {
		computeAccelerationVector(this, objects);
		if(this.engine.isOn() && !this.tank.isEmpty())
			this.acceleration.add(this.cape.setLength(this.engine.power));
		// Vf = Vi + at
		this.velocity = this.velocity.add(this.acceleration.multiplyScalar(time));
	}

	startEngine() {
		if(this.engine.isOff())
			this.engine.start();
	}

	stopEngine() {
		if(this.engine.isOn())
			this.engine.stop();
	}

	fillTank() {
		this.tank.fill();
	}

	move(distance) {
		if(this.engine.isOn())
			this.tank.consume(distance * this.tank.consumption / 100);
	}
}

export default Pod;