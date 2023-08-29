class Action {
	constructor(uniqueValue, payload, plugin) {
		this.uniqueValue = uniqueValue;

		this.plugin = plugin;

		this.coordinates = payload.coordinates;
		this.isMultiAction = payload.isMultiAction;
		this.settings = payload.settings;
	}

	updateSettings(settings) {
		this.settings = settings;
	}

	async destructor() { return; }

	async setState(state) {
		await this.plugin.websocket.send(JSON.stringify({
			"event": "setState",
			"context": this.uniqueValue,
			"payload": { state }
		}));
	}

	async setTitle(title, target, state) {
		await this.plugin.websocket.send(JSON.stringify({
			"event": "setTitle",
			"context": this.uniqueValue,
			"payload": { title, target, state }
		}));
	}

	async setImage(image, target, state) {
		await this.plugin.websocket.send(JSON.stringify({
			"event": "setImage",
			"context": this.uniqueValue,
			"payload": { image, target, state }
		}));
	}

	async showAlert() {
		await this.plugin.websocket.send(JSON.stringify({
			"event": "showAlert",
			"context": this.uniqueValue
		}));
	}

	async showOk() {
		await this.plugin.websocket.send(JSON.stringify({
			"event": "showOk",
			"context": this.uniqueValue
		}));
	}
}

class ActiveAction extends Action {
	async execute() { 
		return await this.showOk(); 
	}
}

class PassiveAction extends Action {
	async execute() { return; }
	async update() { return; }
}
