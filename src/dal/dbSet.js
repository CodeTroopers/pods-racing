import dataManager from "dal/dataManager";
import Model from "dal/models/model";

class DBSet {
	constructor(type) {
		if (type !== Model && !Model.isPrototypeOf(type))
			throw new Error(`${type.name} must inherit from ${Model.name}`);
		this.type = type;
	}

	getById(id) {
		return dataManager.getById(id).then((data) => {
			return this.fromJSON(data);
		});
	}

	get(query, ...parameters) {
		return dataManager.get(`SELECT pr.* FROM $ pr WHERE type = "${this.type.name}"${query ? ` AND ${query}` : ""}`, parameters).then((rows) => {
			const objects = [];
			for (const row of rows) {
				objects.push(this.fromJSON(row));
			}
			return objects;
		});
	}

	getFromView(view) {
		return dataManager.executeView(this.type.name, view).then((rows) => {
			const objects = [];
			for (const row of rows) {
				objects.push(this.fromJSON(row));
			}
			return objects;
		});
	}

	fromJSON(data) {
		const object = new this.type();
		Object.assign(object, data);
		return object;
	}
}

export default DBSet;