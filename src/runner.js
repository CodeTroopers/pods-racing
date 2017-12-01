import { Races } from "models/race";

export default class Runner {
	constructor() {

	}

	start() {
		if (!this.timer)
			this.timer = setInterval(this.run, 10 * 60); //execute each 10 minutes
	}

	stop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
	}

	run() {
		// Get active races
		Races.getActiveRaces().then(function (races) {
			// For each race
			for (const race of races) {
				// Get environment objects and pods in race
				Promise.all([race.getEnvironmentObjects(), race.getPods()]).then(function (objects, pods) {
					//For each environment object
					for (const object of objects) {
						//var geometry = new THREE.SphereBufferGeometry( 5, 32, 32 );

					}
					// For each pod
					for (const pod of pods) {
						//For each environment object
						for (const object of objects) {
							const distance = object.position.distance(pod.position) - object.radius;
							if (distance > object.gravityZone)
								continue;
							const offset = object.gravityZone / distance;
						}
						// Compute pod speed
						pod.ComputeSpeed(objects);
						// apply cap
						// compute next position
						// Check if finished for the pod
					}
					// compute ranks
				});
			}
		});
	}
}