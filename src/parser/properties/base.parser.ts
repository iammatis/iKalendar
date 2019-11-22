import IPropertyParser, { Parameters } from '../../types/classes/parsers/property.parser'

class BaseParser<Property> implements IPropertyParser<Property> {
	public parse(value: string, params = ''): Property {
		throw new Error('Method not implemented.')
	}

	protected parseParams(compName: string, parameters: string, validParams: Parameters): Parameters {
		const paramsParsed: Parameters = {}
		if (parameters === '') {
			return {}
		}
        
		if (parameters[0] === ';') { parameters = parameters.substr(1) }

		for (const param of parameters.split(';')) {
			const [ key, value ] = param.split(/=(.+)?/)

			if (key in validParams) {
				paramsParsed[validParams[key]] = value
			} else {
				// Don't throw an error, just dicard the parameter
				console.log(`Discarding not recognized parameter '${key}'.`)
			}
		}

		return paramsParsed
	}

}

export default BaseParser
