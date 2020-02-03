class BuildingError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'BuildingError'
	}
}

export default BuildingError
