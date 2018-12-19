// Plugin module
class Plugin {
	constructor(userOptions = {}) {
		this.options = {}
		Object.assign(this.options, userOptions)
		this.init(options)
	}

	init(options) {
		this.doSomting(options.elem)
	}
}

export default Plugin
