const emit = undefined; // only for eslint hack

export default [
	{
		name: "Model",
		views: {
			Models: {
				map: function (doc, meta) {
					if (doc.type !== "Model")
						return;

					emit(meta.id, doc);
				}
			}
		}
	},
	{
		name: "Race",
		views: {
			activeRaces: {
				map: function (doc, meta) {
					if (doc.type !== "Race")
						return;

					const currentDate = new Date().getTime();
					const startDate = new Date(doc.startDate).getTime();
					const endDate = new Date(doc.endDate).getTime();
					if (startDate <= currentDate && (!endDate || endDate > currentDate))
						emit(meta.id, doc);
				}
			}
		}
	}
];