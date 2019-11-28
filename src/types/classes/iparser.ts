import { Calendar } from '../calendar'

interface IParser {
    parse(object: string): Calendar
}

export default IParser
