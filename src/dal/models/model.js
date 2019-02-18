import dataManager from "dal/dataManager";

class Model {
	constructor() {
	}

	save() {
		return dataManager.save(this).then((id) => {
			this.id = id;
		});
	}
}

export default Model;