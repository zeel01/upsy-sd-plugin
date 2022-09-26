class UpsySD extends SDPlugin {
	constructor(inPort, inPluginUUID, inRegisterEvent, inInfo, upsyAddr) {
		super(inPort, inPluginUUID, inRegisterEvent, inInfo);

		this.host = upsyAddr;
		this.scheme = "http";
	}
}