import IPropertyParser, { Parameters } from '../../types/classes/parsers/property.parser'

const DQUOTES = /^"(?<value>.*)"$/

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
				const { groups = {} } = value.match(DQUOTES) || {};

				const parameter = validParams[key];
				if (typeof parameter === 'object') {
					paramsParsed[parameter.name]  = parameter.lambda(groups.value || value)
				} else {
					paramsParsed[parameter] = groups.value || value
				}

			} else {
				// Don't throw an error, just discard the parameter
				console.log(`Discarding not recognized parameter '${key}'.`)
			}
		}

		return paramsParsed
	}

}

export default BaseParser
