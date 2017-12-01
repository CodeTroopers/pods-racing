import dataManager from "dataManager";

class Model {

	constructor() {
	}

	save() {
		return dataManager.save(this).then((id) => {
			this.id = id;
		});
	}

	static get(id, type = Model) {
		if(type !== Model && !Model.isPrototypeOf(type))
			return Promise.reject(new Error(`${type.name} must inherit from ${Model.name}`));

		return dataManager.getById(type.name, id).then((data) => {
			const object = new type();
			Object.assign(object, data);
			return object;
		});
	}
}

class Models {
	static get(query, parameters, type = Model) {
		if(type !== Model && !Model.isPrototypeOf(type))
			return Promise.reject(new Error(`${type.name} must inherit from ${Model.name}`));

		return dataManager.get(`SELECT pr.* FROM $ pr WHERE type = "${type.name}"${query ? ` AND ${query}` : ""}`, parameters).then((rows) => {
			const objects = [];
			for (const row of rows) {
				const object = new type();
				Object.assign(object, row);
				objects.push(object);
			}
			return objects;
		});
	}

	static getFromView(view, type = Model) {
		if(type !== Model && !Model.isPrototypeOf(type))
			return Promise.reject(new Error(`${type.name} must inherit from ${Model.name}`));

		return dataManager.executeView(type.name, view).then((rows) => {
			const objects = [];
			for (const row of rows) {
				const object = new type();
				Object.assign(object, row);
				objects.push(object);
			}
			return objects;
		});
	}
}

export { Models, Model };