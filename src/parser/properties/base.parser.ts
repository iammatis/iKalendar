import IPropertyParser, { InputParameters, OutputParameters } from '../../types/classes/parsers/property.parser'

const DQUOTES = /^"(?<value>.*)"$/

class BaseParser<Property> implements IPropertyParser<Property> {
	public parse(value: string, params = ''): Property {
		throw new Error('Method not implemented.')
	}

	protected parseParams(compName: string, parameters: string, validParams: InputParameters): OutputParameters {
		const parsed: OutputParameters = {}
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
					parsed[parameter.name]  = parameter.lambda(groups.value || value)
				} else {
					parsed[parameter] = groups.value || value
				}

			} else {
				// Don't throw an error, just discard the parameter
				console.log(`Discarding not recognized parameter '${key}'.`)
			}
		}

		return parsed
	}

}

export default BaseParser
