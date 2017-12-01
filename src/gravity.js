const G = 6.67408e-11;

export default class Gravity {
	computeGravity(object1, object2) {
		// F = G.m1.m2/d²
		let distanceToSquared = object1.position.distanceToSquared(object2.position);
		return G * object1.mass * object2.mass / distanceToSquared;
	}

	computeAcceleration(object1, object2) {
		// F = m1.a => a = F/m1 => a = G.m2/d²
		let distanceToSquared = object1.position.distanceToSquared(object2.position);
		return G * object2.mass / distanceToSquared;
	}

	computeAccelerationNext(object1, objects) {
		for (let object of objects) {
			// TODO : need to use the force direction
			object1.acceleration += this.computeAcceleration(object1, object);
		}
	}

	computeVelocity(object1, time) {
		object1.velocity = object1.velocity + object1.acceleration * time;
	}
}