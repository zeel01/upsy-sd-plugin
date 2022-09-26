class Action {
	constructor(uniqueValue, payload, plugin) {
		this.uniqueValue = uniqueValue;

		this.plugin = plugin;

		this.coordinates = payload.coordinates;
		this.isMultiAction = payload.isMultiAction;
		this.settings = payload.settings;
	}
}

class ActiveAction extends Action {
	async execute() { return; }
}

class PassiveAction extends Action {
	async update() { return; }
}