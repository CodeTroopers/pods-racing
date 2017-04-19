"use strict";

define(["core/dataManager"], function (dataManager) {
	const type = "Pod";

	return class Pod {
		constructor(name) {
			this.type = type;
			this.name = name;
			this.positions = [];
		}

		save() {
			var self = this;
			return dataManager.save(this).then(function (id) {
				self.id = id;
			});
		}

		static get(id) {
			return dataManager.getById(type, id).then(function (data) {
				var pod = new Pod();
				Object.assign(pod, data);
				return pod;
			});
		}
	};
});
