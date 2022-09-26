class PropertyInspector {
	static UUID = "com.lordzeel.upsy-sd";

	constructor(actionName, inPort, inPropertyInspectorUUID, inRegisterEvent, inInfo, inActionInfo) {
		this.websocket = new WebSocket("ws://localhost:" + inPort);

		this.uniqueValue = inPropertyInspectorUUID;

		this.websocket.onmessage = this.onMessage.bind(this);

		this.actionName = actionName;

		this.init(inPropertyInspectorUUID, inRegisterEvent);
	}

	async init(inPropertyInspectorUUID, inRegisterEvent) {
		let resolve;
		this.wsReady = new Promise(res => resolve = res);

		this.websocket.onopen = async () => {
			await this.websocket.send(JSON.stringify({
				"event": inRegisterEvent,
				"uuid": inPropertyInspectorUUID
			}));

			resolve();
		}

		await this.wsReady;
		await this.getSettings();

		this.setValues();
		this.addEventListeners();
	}

	onMessage(event) {
		const data = JSON.parse(event.data);
		console.log(data);

		if (this[data.event]) this[data.event](event, data);
	}

	get action() {
		return `${PropertyInspector.UUID}.${this.actionName}`;
	}

	didReceiveSettings(event, data) {
		console.log(data);

		this.settings = data.payload.settings;

		if (!this.settingsResolver) return;
		this.settingsResolver(this.settings);
	}

	async sendValueToPlugin(property, value) {
		await this.websocket.send(JSON.stringify({
			"action": this.action,
			"event": "sendToPlugin",
			"context": this.uniqueValue,
			"payload": {
				[property]: value
			}
		}));
	}

	async getSettings() {
		await this.websocket.send(JSON.stringify({
			"event": "getSettings",
			"context": this.uniqueValue
		}));

		return await new Promise(res => this.settingsResolver = res);
	}

	async setSettings(settings) {
		console.log(settings);
		await this.websocket.send(JSON.stringify({
			"event": "setSettings",
			"context": this.uniqueValue,
			"payload": settings
		}));

		return await new Promise(res => this.settingsResolver = res);
	}

	setValues() {
		document.querySelectorAll("input").forEach(input => {
			if (input.type == "radio") {
				if (input.value == this.settings[input.name]) input.checked = true;
			}
			else input.value = this.settings[input.name] || "";
		});

		document.querySelector(".sdpi-wrapper").classList.remove("hidden");
	}

	addEventListeners() {
		const inputs = document.querySelectorAll("input");
		inputs.forEach(input => {
			input.addEventListener("change", async event => {
				const property = event.currentTarget.name;
				const value = event.currentTarget.value;

				this.settings[property] = value;
				await this.setSettings(this.settings);
			});
		});

		window.addEventListener("unload", async event => {
			inputs.forEach(input => {
				const property = input.name;
				const value = input.value;

				if (input.type == "radio" && !input.checked) return;

				this.settings[property] = value;
			});
			
			await this.setSettings(this.settings);
			await this.websocket.close();
		});
	}
}