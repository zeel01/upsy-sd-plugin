const UpsyAction = Base => class extends Base {
	get baseURL() {
		return `${this.plugin.scheme}://${this.plugin.host}`;
	}

	get fetchOptions() {
		return { method: "POST" }
	}

	getURL() {
		return this.baseURL;
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
		const response = await fetch(this.getURL(height), this.fetchOptions);

		if (response.status !== 200) return false;

		return true;
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

		const response = await fetch(this.getURL(preset), this.fetchOptions);

		if (response.status !== 200) return false;

		return true;
	}
}

class ShowHeightAction extends UpsyAction(PassiveAction) {

}

const Actions = {
	setheight: SetHeightAction,
	gopreset: PresetAction,
	showheight: ShowHeightAction
}