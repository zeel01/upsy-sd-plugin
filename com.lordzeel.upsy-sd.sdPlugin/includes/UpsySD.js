class UpsySD extends SDPlugin {
	constructor(inPort, inPluginUUID, inRegisterEvent, inInfo) {
		super(inPort, inPluginUUID, inRegisterEvent, inInfo);

		this.scheme = "http";
	}
}