import IFormatter from './types/classes/iformatter'
import { Attachment, Attendee, ComplexDate, Duration, FreeBusyProperty, GeoPosition, Organizer, Period, RecurrenceDate, Relation, Trigger, XProp } from './types/general'
import RRule from 'rrule'

class Formatter implements IFormatter {
	public formatString(attrName: string, value?: string | number): string {
		return value !== undefined && value !== '' && value !== null
			? this.foldLine(`${attrName}:${this.escapeChars(value)}`)
			: ''
	}
    
	public formatStrings(attrName: string, values?: string[], sep = ','): string {
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
					const typeValue = 'VALUE=DATE'
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
				values = dates ? dates.join(',') : ''
				break

			case 'PERIOD':
				typeValue = ';VALUE=PERIOD'
				values = periods ? periods.map(period => this.formatPeriod(period)).join(',') : ''
				break
            
			default: // DATE-TIME
				values = dates ? dates.map(date => this.formatDateTime({ value: date, type, tzId })).join(',') : ''
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
			const { address, cn, dir, sentBy, scheduleStatus } = organizer
			const optionals = [
				cn ? `CN=${cn}` : '',
				dir ? `DIR="${dir}"` : '',
				sentBy ? `SENT-BY="mailto:${sentBy}"` : '',
				scheduleStatus ? `SCHEDULE-STATUS="${(Array.isArray(scheduleStatus) ? scheduleStatus : [ scheduleStatus ]).join(',')}"` : ''
			].filter(Boolean).join(';')

			const line = optionals
				? `ORGANIZER;${optionals}:mailto:${address}`
				: `ORGANIZER:mailto:${address}`
			return this.foldLine(line)
		}
		return ''
	}
    
	public formatDuration(duration?: Duration, attrName?: string): string {
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
			return this.foldLine(attrName ? `${attrName}:${line}`: line)
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
			const { address, cn, dir, sentBy, cu, member, role, partstat, rsvp, delegatedTo, delegatedFrom, scheduleStatus } = attendee
			const optionals = [
				cn ? `CN=${cn}` : '',
				dir ? `DIR=${dir}` : '',
				sentBy ? `SENT-BY=${sentBy}` : '',
				cu ? `CUTYPE=${cu}` : '',
				member ? `MEMBER=${member.map(mem => `"mailto:${mem}"`).join(',')}` : '',
				role ? `ROLE=${role}` : '',
				partstat ? `PARTSTAT=${partstat}` : '',
				rsvp ? `RSVP=${rsvp}` : '',
				delegatedTo ? `DELEGATED-TO=${delegatedTo.map(del => `"mailto:${del}"`).join(',')}` : '',
				delegatedFrom ? `DELEGATED-FROM=${delegatedFrom.map(del => `"mailto:${del}"`).join(',')}` : '',
				scheduleStatus ? `SCHEDULE-STATUS="${(Array.isArray(scheduleStatus) ? scheduleStatus : [ scheduleStatus ]).join(',')}"` : ''
			].filter(Boolean).join(';')

			const line = optionals
				? `ATTENDEE;${optionals}:mailto:${address}`
				: `ATTENDEE:mailto:${address}`
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

	public formatRRule(rrule?: RRule): string {
		return rrule ? this.foldLine(rrule.toString()) : ''
	}
    
	public formatXProp(xProp?: XProp): string {
		return xProp ? this.foldLine(`X-${xProp.name.toUpperCase()}:${xProp.value}`) : ''
	}
    
	public formatXProps(xProps: XProp[] = []): string {
		return xProps.map(xProp => this.formatXProp(xProp)).join('\r\n')
	}

	public formatFBProperty(freebusy: FreeBusyProperty): string {
		const { type, value } = freebusy
		const periods = value.map(period => this.formatPeriod(period))
		const line = `FREEBUSY;FBTYPE=${type}:${periods}`

		return this.foldLine(line)
	}

	public formatFBProperties(fBProperties: FreeBusyProperty[] = []): string {
		return fBProperties.map(freebusy => this.formatFBProperty(freebusy)).join('\r\n')
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

	private formatPeriod(period: Period): string {
		const { start, end, duration } = period
		const startValue = this.formatDateTime(start)
		const endValue = end ? this.formatDateTime(end) : this.formatDuration(duration)

		return `${startValue}/${endValue}`
	}

	private formatDateTime(date: string | ComplexDate): string {
		return typeof date === 'string' ? date : date.value
	}

	private escapeChars(value: string | number): string | number {
		if (typeof value === 'number') {
			return value;
		}
		
		return value
			.replace(/\\/g, '\\\\')
			.replace(/;/g, '\\;')
			.replace(/,/g, '\\,')
			.replace(/r?\n/g, '\\n')	
	}
}

export default Formatter
