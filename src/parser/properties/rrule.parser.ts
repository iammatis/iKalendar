import IPropertyParser from '../../types/classes/parsers/property.parser'

class RRuleParser implements IPropertyParser<any> {
    public parse(iCalValue: string): any {
        return iCalValue
    }
}

export default RRuleParser
