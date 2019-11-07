import * as moment from 'moment'
import Calendar from './types/calendar'
import IFormatter from "./types/classes/formatter"
import { Alarm, Event, FreeBusy, Journal, TimeZone, Todo } from "./types/components"
import { Attachment, Attendee, ComplexDate, Duration, GeoPosition, Organizer, RecurrenceDate, Relation, Trigger, XProp } from "./types/general"

class Formatter implements IFormatter {
    private array: string[]
    private calendar: Calendar


    constructor(calendar: Calendar) {
        this.array = []
        this.calendar = calendar
    }

    public format(): string {
        const data = this.array.join('\r\n')

        const { version, prodId, calscale, method } = this.calendar
        return [
            'BEGIN:VCALENDAR',
            `VERSION:${version}`,
            `PRODID:${prodId}`,
            calscale ? `CALSCALE:${calscale}` : '',
            method ? `METHOD:${method}` : '',
            data,
            'END:VCALENDAR'
        ].filter(Boolean).join('\r\n')
    }
    
    public addEvent(event?: Event): void {
        if (event) {
            this.add('BEGIN:VEVENT')
            this.addDate('DTSTAMP', event.dtStamp)
            this.addString('UID', event.uid)
            this.addDate('DTSTART', event.start)
            this.addString('CLASS', event.class)
            this.addDate('CREATED', event.created)
            this.addString('DESCRIPTION', event.description)
            this.addGeoPosition(event.geo)
            this.addDate('LAST-MODIFIED', event.lastModified)
            this.addString('LOCATION', event.location)
            this.addOrganizer(event.organizer)
            this.addNumber('PRIORITY', event.priority)
            this.addNumber('SEQUENCE', event.sequnce)
            this.addString('STATUS', event.status)
            this.addString('SUMMARY', event.summary)
            this.addString('TRANSP', event.transp)
            this.addString('URL', event.url)
            this.addString('RECURRENCE-ID', event.recurrenceId)
            // TODO: Rule
            this.addString('STATUS', event.rrule)
            this.addDate('DTEND', event.end)
            this.addDuration(event.duration)
            this.addAttachments(event.attachments)
            this.addAttendees(event.attendees)
            this.addStrings('CATEGORIES', event.categories)
            this.addString('COMMENT', event.comment)
            this.addString('CONTACT', event.contact)
            this.addDate('EXDATE', event.exdate)
            this.addRelations(event.relatedTo)
            this.addStrings('RESOURCES', event.resources)
            this.addRDate(event.rdate)
            this.addXprops(event.xProps)
            this.addAlarms(event.alarms)
            this.add('END:VEVENT')
        }
    }
    
    public addEvents(events: Event[] = []): void {
        events.forEach(event => this.addEvent(event))
    }
    
    public addTodo(todo?: Todo): void {
        throw new Error("Method not implemented.")
    }
    
    public addTodos(todo?: Todo[]): void {
        throw new Error("Method not implemented.")
    }
    
    public addJournal(journal?: Journal): void {
        throw new Error("Method not implemented.")
    }
    
    public addJournals(journals?: Journal[]): void {
        throw new Error("Method not implemented.")
    }
    
    public addFreeBusy(freebusy?: FreeBusy): void {
        throw new Error("Method not implemented.")
    }
    
    public addFreeBusyTimes(freebusy?: FreeBusy[]): void {
        throw new Error("Method not implemented.")
    }
    
    public addTimeZone(timeZone?: TimeZone): void {
        throw new Error("Method not implemented.")
    }
    
    public addTimeZones(timeZones?: TimeZone[]): void {
        throw new Error("Method not implemented.")
    }
    
    public addAlarm(alarm?: Alarm): void {
        if (alarm) {
            this.add('BEGIN:VALARM')
            this.addString('ACTION', alarm.action)
            this.addTrigger(alarm.trigger)
            this.addDuration(alarm.duration)
            this.addNumber('REPEAT', alarm.repeat)
            this.addString('DESCRIPTION', alarm.description)
            this.addString('SUMMARY', alarm.summary)
            this.addAttendees(alarm.attendee)
            this.addAttachments(alarm.attach)
            this.addXprops(alarm.xProps)
            this.add('END:VALARM')
        }
    }
    
    public addAlarms(alarms: Alarm[] = []): void {
        alarms.forEach(alarm => this.addAlarm(alarm))
    }

    public add(value: string): void {
        if (value !== '') {
            const lines = this.foldLine(value)
            this.array.push(lines)
        }
    }

    public addString(attrName: string, value?: string): void {
        this.add(value ? `${attrName}:${value}` : '')
    }
    
    public addStrings(attrName: string, values?: string[], sep: string = ','): void {
        this.add(values && values.length ? `${attrName}:${values.filter(Boolean).join(sep)}` : '')
    }

    public addNumber(attrName: string, value?: number): void {
        this.add(value !== undefined ? `${attrName}:${value}` : '')
    }
    
    public addDate(attrName: string, date?: string | ComplexDate): void {
        if (date) {
            if (typeof date === 'string') {
                this.add(`${attrName}:${moment(date).format('YYYYMMDDTHHmmss')}`)
            } else {
                const { value, type, tzId } = date
                
                if (type && type === 'DATE') {
                    const typeValue = `VALUE=DATE`
                    const tz = tzId ? `;TZID=${tzId}` : ''
                    const momentDate = moment(value).format('YYYYMMDD')
                    this.add(`${attrName};${typeValue}${tz}:${momentDate}`)
                } else {
                    const tz = tzId ? `;TZID=${tzId}` : ''
                    const momentDate = moment(value).format('YYYYMMDDTHHmmss')
                    this.add(`${attrName}${tz}:${momentDate}`)
                }
            }
        }
    }

    public addRDate(rDate?: RecurrenceDate): void {
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
                        const startValue = moment(start).format('YYYYMMDDTHHmmss')
                        const endValue = end ? moment(end).format('YYYYMMDDTHHmmss') : this.formatDuration(duration!)
                        return `${startValue}/${endValue}`
                    }).join(',') : ''
                    break
            
                default: // DATE-TIME
                    values = dates ? dates.map(date => moment(date).format('YYYYMMDDTHHmmss')).join(',') : ''
                    break
            }

            this.add(`RDATE${tzIdValue}${typeValue}:${values}`)
        }
    }
    
    public addGeoPosition(geo?: GeoPosition): void {
        this.add(geo ? `GEO:${geo.lat};${geo.lon}` : '')
    }
    
    public addOrganizer(organizer?: Organizer): void {
        if (organizer) {
            const { address, cn, dir, sentBy } = organizer
            const optionals = [
                cn ? `CN=${cn}` : '',
                dir ? `DIR=${dir}` : '',
                sentBy ? `CN=${sentBy}` : ''
            ].filter(Boolean).join(';')

            this.add(optionals
                ? `ORGANIZER;${optionals}:${address}`
                : `ORGANIZER:${address}`)
        }
    }
    
    public addDuration(duration?: Duration): void {
        if (duration) {
            this.addString('DURATION', this.formatDuration(duration))
        }
    }
    
    public addAttachment(attachment?: Attachment): void {
        if (attachment) {
            this.add(attachment.type
                ? `ATTACH;FMPTYPE=${attachment.type}:${attachment.value}`
                : `ATTACH:${attachment.value}`)
        }
    }
    
    public addAttachments(attachments: Attachment[] = []): void {
        attachments.forEach(attachment => this.addAttachment(attachment))
    }
    
    public addAttendee(attendee?: Attendee): void {
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

            this.add(optionals
                ? `ATTENDEE;${optionals}:${address}`
                : `ATTENDEE:${address}`)
        }
    }
    
    public addAttendees(attendees: Attendee[] = []): void {
        attendees.forEach(attendee => this.addAttendee(attendee))
    }
    
    public addRelation(relation?: Relation): void {
        if (relation) {
            this.add(relation.type
                ? `RELATED-TO;RELTYPE=${relation.type}:${relation.value}`
                : `RELATED-TO:${relation.value}`)
        }
    }
    
    public addRelations(relations: Relation[] = []): void {
        relations.forEach(relation => this.addRelation(relation))
    }

    public addTrigger(trigger?: Trigger): void {
        if (trigger) {
            const optional = trigger.related ? `RELATED=${trigger.related}` : null

            let value
            if (typeof trigger.value === 'string') { // DateTime
                // TODO: DateTime
                value = moment(trigger.value).format('YYYYMMDDTHHmmss')
            } else { // Duration
                value = this.formatDuration(trigger.value)
            }
            this.add(optional
                ? `TRIGGER;${optional}:${value}`
                : `TRIGGER:${value}`)
        }
    }
    
    public addXprop(xProp?: XProp): void {
        this.add(xProp ? `X-${xProp.name}:${xProp.value}` : '')
    }
    
    public addXprops(xProps: XProp[] = []): void {
        xProps.forEach(xProp => this.addXprop(xProp))
    }

    private formatDuration(duration: Duration): string {
        const { before, week, day, hour, minute, second } = duration
        return [
            before ? '-' : '',
            'P',
            week ? `${week}W` : '',
            day ? `${day}D` : '',
            (hour || minute || second) ? 'T' : '',
            hour ? `${hour}H` : '',
            minute ? `${minute}M` : '',
            second ? `${second}S` : '',
        ].filter(Boolean).join('')
    }

    private foldLine(line: string): string {
        const MAX_LENGTH = 75
        const lines = []
        while (line.length > MAX_LENGTH) {
            lines.push(line.slice(0, MAX_LENGTH))
            line = line.slice(MAX_LENGTH)
        }
        lines.push(line)
        return lines.join('\r\n\t')
    }

}

export default Formatter
