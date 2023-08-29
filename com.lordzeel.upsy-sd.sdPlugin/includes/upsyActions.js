const UpsyAction = Base => class extends Base {
	get host() {
		return this.settings.address;
	}

	get baseURL() {
		return `${this.plugin.scheme}://${this.host}`;
	}

	get fetchOptionsPOST() {
		return { method: "POST" }
	}

	get fetchOptionsGET() {
		return { method: "GET" }
	}

	getURL() {
		return this.baseURL;
	}

	async fetch(url) {
		try {
			const response = await fetch(url, this.fetchOptionsPOST);
			if (response.ok) this.showOk();
			else throw new Error(response.statusText);
		}
		catch (error) {
			console.error(error);
			this.showAlert();
		}
	}

  async fetchGet(url) {
    try {
      const response = await fetch(url, this.fetchOptionsGET);

      if (response.ok) {
        const data = await response.json();
        this.showOk();
        return data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
      this.showAlert();
      return null; 
    }
  }
}

class SetRelativeHeightAction extends UpsyAction(ActiveAction) {
	constructor(uniqueValue, payload, plugin) {
		super(uniqueValue, payload, plugin);

		this.height = 0.0;
  }

	async execute(type) {
    var currHeight = await this.getCurrentHeight();
    console.log(currHeight);
    console.log( +(Math.round(Number(currHeight) + Number(this.settings.height) + "e+1") + "e-1") );
    if (type == "down") return await this.commandHeight(Number(currHeight) + Number(this.settings.height));
	}

	getURL(height) {
		return `${this.baseURL}/number/target_desk_height/set?value=${height}`;
	}

	async getCurrentHeight() {
    const CURRENT_HEIGHT_URL = `${this.baseURL}/sensor/desk_height`;
    const data = await this.fetchGet(CURRENT_HEIGHT_URL);
    if (data.id =="sensor-desk_height") {
        this.height = data.value;
    }

		return this.height;
  }

	async commandHeight(height) {
		await this.fetch(this.getURL(height));
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
	showheight: ShowHeightAction,
	setrelativeheight: SetRelativeHeightAction
}
