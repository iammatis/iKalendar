import ParsingError from '../../exceptions/parser.error'
import { GeoPosition } from '../../types/general'
import BaseParser from './base.parser'

class GeoParser extends BaseParser<GeoPosition> {
    public parse(iCalValue: string): GeoPosition {
        const [lat, lon] = iCalValue.split(';')

        if (!lat || !lon) {
            throw new ParsingError(`Invalid iCalendar geo value: ${iCalValue}`)
        }

        return { lat: parseFloat(lat), lon: parseFloat(lon) }
    }
}

export default GeoParser
