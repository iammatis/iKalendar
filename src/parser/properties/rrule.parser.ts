import IPropertyParser from '../../types/classes/parsers/property.parser'
import RRule from 'rrule'

class RRuleParser implements IPropertyParser<RRule> {
	public parse(iCalValue: string): RRule {
		return RRule.fromString(iCalValue)
	}
}

export default RRuleParser
