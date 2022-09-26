class SDPlugin {
	constructor(inPort, inPluginUUID, inRegisterEvent, inInfo) {
		this.websocket = new WebSocket("ws://localhost:" + inPort);

		this.uniqueValue = inPluginUUID;

		this.websocket.onopen = () => this.websocket.send(JSON.stringify({
			"event": inRegisterEvent,
			"uuid": inPluginUUID
		}));

		this.websocket.onmessage = this.onMessage.bind(this);

		this.actions = {};
	}

	onMessage(event) {
		const data = JSON.parse(event.data);
		console.log(data);

		if (this[data.event]) this[data.event](event, data);
	}

	async getSettings() {
		await this.websocket.send(JSON.stringify({
			"event": "getSettings",
			"context": this.uniqueValue
		}));
	}

	didReceiveSettings(event, data) {
		if (this.actions[data.context])
			this.actions[data.context].updateSettings(data.payload.settings);
	}

	willAppear(event, data) {
		const actionType = data.action.split(".").pop();

		this.actions[data.context] =
			new Actions[actionType](data.context, data.payload, this);
	}

	async willDisappear(event, data) {
		await this.actions[data.context]?.destructor();
		delete this.actions[data.context];
	}

	async keyDown(event, data) {
		if (this.actions[data.context])
			await this.actions[data.context].execute("down");
	}

	async keyUp(event, data) {
		if (this.actions[data.context])
			await this.actions[data.context].execute("up");
	}
}