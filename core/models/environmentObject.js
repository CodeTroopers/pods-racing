"use strict";

define(["core/dataManager"], function (dataManager) {
	const type = "EnvironmentObject";

	return class EnvironmentObject {
		constructor(position) {
			this.type = type;
			this.position = position || {
				x: 0,
				y: 0,
				z: 0
			};
		}

		save() {
			var self = this;
			return dataManager.save(this).then(function (id) {
				self.id = id;
			});
		}

		static get(id) {
			return dataManager.getById(type, id).then(function (data) {
				var environmentObject = new EnvironmentObject();
				Object.assign(environmentObject, data);
				return environmentObject;
			});
		}
	};
});
