define(["require", "models/race", "models/pod"], function (require, Race, Pod) {
	"use strict";

	return class Runner {
		var timer;

		constructor {}

		start() {
			if (!timer)
				timer = setInterval(run, 10 * 60); //execute each 10 minutes
		}

		stop() {
			if (timer) {
				clearInterval(timer);
				timer = undefined;
			}
		}

		run() {
			// Get active races
			Race.getActiveRaces().then(function (races) {
				// For each race
				for (var race of races) {
					// Get environment objects and pods in race
					q.all([race.getEnvironmentObjects(), race.getPods()]).then(function (objects, pods) {
						// For each pod
						for (var pod of pods) {
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
	};
});
