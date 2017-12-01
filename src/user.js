import dataManager from "dataManager";
import Pod from "models/pod";
const type = "User";

export default class User {
	constructor(name) {
		this.type = type;
		this.name = name;
	}

	save() {
		return dataManager.save(this).then((id) => {
			this.id = id;
		});
	}

	getPods() {
		return dataManager.get("SELECT pods.*, $1 userId FROM $ USE KEYS $1 UNNEST pods ORDER BY pods.name", [this.id]).then((rows) => {
			let pods = [];
			for (let row of rows) {
				let pod = new Pod();
				//Object.assign(pod, row);
				pods.push(pod);
			}
			return pods;
		});
	}

	static get(id) {
		return dataManager.getById(type, id).then((data) => {
			let user = new User();
			//Object.assign(user, data);
			return user;
		});
	}

	static getByName(name) {
		// TODO: Treat then
		return dataManager.get("SELECT * FROM $ WHERE name=$1", [name]);
	}
}