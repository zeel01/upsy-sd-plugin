const UpsyAction = Base => class extends Base {
	get host() {
		return this.settings.address;
	}

	get baseURL() {
		return `${this.plugin.scheme}://${this.host}`;
	}

	get fetchOptions() {
		return { method: "POST" }
	}

	getURL() {
		return this.baseURL;
	}

	async fetch(url) {
		try {
			const response = await fetch(url, this.fetchOptions);
			if (response.ok) this.showOk();
			else throw new Error(response.statusText);
		}
		catch (error) {
			console.error(error);
			this.showAlert();
		}
	}
}


class SetHeightAction extends UpsyAction(ActiveAction) {
	async execute(type) {
		if (type == "down") return await this.commandHeight(this.settings.height);
	}

	getURL(height) {
		return `${this.baseURL}/number/target_desk_height/set?value=${height}`;
	}

	async commandHeight(height) {
		await this.fetch(this.getURL(height));
	}
}

class PresetAction extends UpsyAction(ActiveAction) {
	async execute(type) {
		if (type == "down") return await this.commandPreset(this.settings.preset);
	}

	getURL(preset) {
		return `${this.baseURL}/button/desk_preset_${preset}/press`;
	}

	async commandPreset(preset) {
		if (Number(preset) > 4 || Number(preset) < 1) return false;

		await this.fetch(this.getURL(preset));
	}
}

class ShowHeightAction extends UpsyAction(PassiveAction) {
	constructor(uniqueValue, payload, plugin) {
		super(uniqueValue, payload, plugin);

		this.height = 0.0;
		this.units = "in";

		this.eventSource = new EventSource(this.getURL());
		this.eventSource.addEventListener("state", this.onMessage.bind(this))
	}

	get heightString() {
		return `${this.height} ${this.units}`;
	}

	get prefix() {
		return this.settings.prefix || "";
	}

	getURL() {
		return `${this.baseURL}/events`;
	}

	onMessage(event) {
		const data = JSON.parse(event.data);
		console.log(data);

		switch (data.id) {
			case "sensor-desk_height": 
				this.height = data.value;
				this.update();
				break;
			case "select-upsy_desky_height_units":
				this.units = data.value;
				this.update();
				break;
		}
	}

	updateSettings(settings) {
		super.updateSettings(settings);
		this.update();
	}

	async update() {
		console.log(this.prefix, this.heightString);
		await this.setTitle(`${this.prefix}\n${this.heightString}`, 0);
	}

	destructor() {
		this.eventSource.close();
	}
}

const Actions = {
	setheight: SetHeightAction,
	gopreset: PresetAction,
	showheight: ShowHeightAction
}