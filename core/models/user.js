"use strict";

define(["core/dataManager", "core/models/pod"], function (dataManager, Pod) {
	const type = "User";

	return class User {
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
			return dataManager.get("SELECT pods.*, $1 userId FROM " + dataManager.bucketName + " USE KEYS $1 UNNEST pods ORDER BY pods.name", [this.id]).then(function (rows) {
				var pods = [];
				for (var row of rows) {
					var pod = new Pod();
					Object.assign(pod, row);
					pods.push(pod);
				}
				return pods;
			});
		}

		static get(id) {
			return dataManager.getById(type, id).then(function (data) {
				var user = new User();
				Object.assign(user, data);
				return user;
			});
		}

		static getByName(name) {
			// TODO: Treat then
			return dataManager.get("SELECT * FROM `" + dataManager.bucketName + "` WHERE name=$1", [name]);
		}
	};
});
