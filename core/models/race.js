"use strict";

define(["core/dataManager", "core/models/pod", "core/models/environmentObject"], function (dataManager, Pod, EnvironmentObject) {
	const type = "Race";

	return class Race {
		constructor(name) {
			this.type = type;
			this.name = name;
		}

		save() {
			var self = this;
			return dataManager.save(this).then(function (id) {
				self.id = id;
			});
		}

		getPods() {
			return dataManager.get("SELECT pr.* FROM $ pr WHERE type = \"Pod\" AND ANY position IN positions SATISFIES position.raceId = $1 END", [this.id]).then(function (rows) {
				var pods = [];
				for (var row of rows) {
					var pod = new Pod();
					Object.assign(pod, row);
					pods.push(pod);
				}
				return pods;
			});
		}

		getEnvironmentObjects() {
			return dataManager.get("SELECT pr.* FROM $ pr WHERE type = \"EnvironmentObject\" AND raceId = $1", [this.id]).then(function (rows) {
				var environmentObjects = [];
				for (var row of rows) {
					var environmentObject = new EnvironmentObject();
					Object.assign(environmentObject, row);
					environmentObjects.push(environmentObject);
				}
				return environmentObjects;
			});
		}

		static get(id) {
			return dataManager.getById(type, id).then(function (data) {
				var race = new Race();
				Object.assign(race, data);
				return race;
			});
		}

		static getActiveRaces() {
			return dataManager.executeView(type, "activeRaces").then(function (rows) {
				var races = [];
				for (var row of rows) {
					var race = new Race();
					Object.assign(race, row);
					races.push(race);
				}
				return races;
			});
		}
	};
});
