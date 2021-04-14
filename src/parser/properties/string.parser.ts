import BaseParser from './base.parser'

class StringParser extends BaseParser<string> {
	public parse(iCalValue: string, params = ''): string {
		return iCalValue
			.replace(/\\n/g, '\n')
			.replace(/\\;/g, ';')
			.replace(/\\,/g, ',')
			.replace(/\\\\/g, '\\');
	}
}

export default StringParser
