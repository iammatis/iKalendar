import ParsingError from '../../exceptions/parser.error'
import IPropertyParser, { Parameters } from '../../types/classes/parsers/property.parser'

class BaseParser<Property> implements IPropertyParser<Property> {
    public parse(value: string): Property {
        throw new Error('Method not implemented.')
    }

    protected parseParams(parameters: string, validParams: Parameters): Parameters {
        const optionals: Parameters = {}

        for (const param of parameters.split(';')) {
            const [key, value] = param.split(/=(.+)?/)

            if (key in validParams) {
                optionals[validParams[key]] = value
            } else {
                throw new ParsingError(`Invalid iCalendar organizer parameter: '${key}'`)
            }
        }

        return optionals
    }

}

export default BaseParser
