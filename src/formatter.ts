import * as moment from 'moment-timezone'
import IFormatter from './types/classes/iformatter'
import { Attachment, Attendee, ComplexDate, Duration, GeoPosition, Organizer, RecurrenceDate, Relation, Trigger, XProp } from './types/general'

class Formatter implements IFormatter {
    public formatString(attrName: string, value?: string | number): string {
        return value !== undefined && value !== ''
            ? this.foldLine(`${attrName}:${value}`)
            : ''
    }
    
    public formatStrings(attrName: string, values?: string[], sep: string = ','): string {
        return values && values.length
            ? this.foldLine(`${attrName}:${values.filter(Boolean).join(sep)}`)
            : ''
    }
    
    public formatDate(attrName: string, date?: string | ComplexDate): string {
        if (date) {
            if (typeof date === 'string') {
                const dateString = this.formatDateTime(date)
                return this.foldLine(`${attrName}:${dateString}`)
            } else {
                const { type, tzId } = date
                const tz = tzId ? `;TZID=${tzId}` : ''
                
                if (type && type === 'DATE') {
                    const typeValue = `VALUE=DATE`
                    const dateString = this.formatDateTime(date)
                    return this.foldLine(`${attrName};${typeValue}${tz}:${dateString}`)
                } else {
                    const dateString = this.formatDateTime(date)
                    return this.foldLine(`${attrName}${tz}:${dateString}`)
                }
            }
        }
        return ''
    }

    public formatRDate(rDate?: RecurrenceDate): string {
        if (rDate) {
            const { type, tzId, dates, periods } = rDate
            const tzIdValue = tzId ? `;TZID=${tzId}` : ''
            let typeValue = ''
            let values = ''

            switch (type) {
                case 'DATE':
                    typeValue = ';VALUE=DATE'
                    values = dates ? dates.map(date => moment(date).format('YYYYMMDD')).join(',') : ''
                    break

                case 'PERIOD':
                    typeValue = ';VALUE=PERIOD'
                    values = periods ? periods.map(period => {
                        const { start, end, duration } = period
                        const startValue = this.formatDateTime(start)
                        const endValue = end ? this.formatDateTime(end) : this.formatDuration(duration)
                        return `${startValue}/${endValue}`
                    }).join(',') : ''
                    break
            
                default: // DATE-TIME
                    values = dates ? dates.map(date => this.formatDateTime({value: date, type, tzId})).join(',') : ''
                    break
            }

            return this.foldLine(`RDATE${tzIdValue}${typeValue}:${values}`)
        }
        return ''
    }
    
    public formatGeo(geo?: GeoPosition): string {
        return geo ? this.foldLine(`GEO:${geo.lat};${geo.lon}`) : ''
    }
    
    public formatOrganizer(organizer?: Organizer): string {
        if (organizer) {
            const { address, cn, dir, sentBy } = organizer
            const optionals = [
                cn ? `CN=${cn}` : '',
                dir ? `DIR=${dir}` : '',
                sentBy ? `CN=${sentBy}` : ''
            ].filter(Boolean).join(';')

            const line = optionals
                ? `ORGANIZER;${optionals}:${address}`
                : `ORGANIZER:${address}`
            return this.foldLine(line)
        }
        return ''
    }
    
    public formatDuration(duration?: Duration): string {
        if (duration) {
            const { isNegative, weeks, days, hours, minutes, seconds } = duration
            const line = [
                isNegative ? '-' : '',
                'P',
                weeks ? `${weeks}W` : '',
                days ? `${days}D` : '',
                (hours || minutes || seconds) ? 'T' : '',
                hours ? `${hours}H` : '',
                minutes ? `${minutes}M` : '',
                seconds ? `${seconds}S` : '',
            ].filter(Boolean).join('')
            return this.foldLine(line)
        }
        return ''
    }
    
    public formatAttachment(attachment?: Attachment): string {
        if (attachment) {
            const line = attachment.type
                ? `ATTACH;FMPTYPE=${attachment.type}:${attachment.value}`
                : `ATTACH:${attachment.value}`
            return this.foldLine(line)
        }
        return ''
    }
    
    public formatAttachments(attachments: Attachment[] = []): string {
        return attachments.map(attachment => this.formatAttachment(attachment)).join('\r\n')
    }
    
    public formatAttendee(attendee?: Attendee): string {
        if (attendee) {
            const { address, cn, dir, sentBy, cu, member, role, partstat, rsvp, delegatedTo, delegatedFrom } = attendee
            const optionals = [
                cn ? `CN=${cn}` : '',
                dir ? `DIR=${dir}` : '',
                sentBy ? `CN=${sentBy}` : '',
                cu ? `CUTYPE=${cu}` : '',
                member ? `MEMBER=${member}` : '',
                role ? `ROLE=${role}` : '',
                partstat ? `PARTSTAT=${partstat}` : '',
                rsvp ? `RSVP=${rsvp}` : '',
                delegatedTo ? `DELEGATED-TO=${delegatedTo.join(',')}` : '',
                delegatedFrom ? `DELEGATED-FROM=${delegatedFrom.join(',')}` : ''
            ].filter(Boolean).join(';')

            const line = optionals
                ? `ATTENDEE;${optionals}:${address}`
                : `ATTENDEE:${address}`
            return this.foldLine(line)
        }
        return ''
    }
    
    public formatAttendees(attendees: Attendee[] = []): string {
        return attendees.map(attendee => this.formatAttendee(attendee)).join('\r\n')
    }
    
    public formatRelation(relation?: Relation): string {
        if (relation) {
            const line = relation.type
                ? `RELATED-TO;RELTYPE=${relation.type}:${relation.value}`
                : `RELATED-TO:${relation.value}`
            return this.foldLine(line)
        }
        return ''
    }
    
    public formatRelations(relations: Relation[] = []): string {
        return relations.map(relation => this.formatRelation(relation)).join('\r\n')
    }

    public formatTrigger(trigger?: Trigger): string {
        if (trigger) {
            const optional = trigger.related ? `RELATED=${trigger.related}` : null

            let value
            if (typeof trigger.value === 'string') { // DateTime
                value = this.formatDateTime(trigger.value)
            } else { // Duration
                value = this.formatDuration(trigger.value)
            }
            const line = optional
                ? `TRIGGER;${optional}:${value}`
                : `TRIGGER:${value}`
            return this.foldLine(line)
        }
        return ''
    }
    
    public formatXprop(xProp?: XProp): string {
        return xProp ? this.foldLine(`X-${xProp.name}:${xProp.value}`) : ''
    }
    
    public formatXprops(xProps: XProp[] = []): string {
        return xProps.map(xProp => this.formatXprop(xProp)).join('\r\n')
    }

    private foldLine(line: string): string {
        const MAX_LENGTH = 75
        const lines = []
        while (line.length > MAX_LENGTH) {
            lines.push(line.slice(0, MAX_LENGTH))
            line = line.slice(MAX_LENGTH)
        }
        lines.push(line)
        return lines.join('\r\n ')
    }

    private formatDateTime(date: string | ComplexDate): string {
        if (typeof date === 'string') {
            const isUTC = date.endsWith('Z')
            const [dateString, ] = date.split('Z')
            return moment(dateString).format('YYYYMMDDTHHmmss') + `${isUTC ? 'Z' : ''}`
        } else {
            const { value, type } = date
            
            if (type && type === 'DATE') {
                return moment(value).format('YYYYMMDD')
            } else {
                const isUTC = value.endsWith('Z')
                const [dateString, ] = value.split('Z')
                return moment(dateString).format('YYYYMMDDTHHmmss') + `${isUTC ? 'Z' : ''}`
            }
        }
    }
}

export default Formatter
