import Formatter from './formatter'
import { Calendar, Alarm, Event } from './types'
import IBuilder from './types/classes/ibuilder'
import BuildingError from './exceptions/builder.error'

const defaultCalendar: Calendar = {
	prodId: 'iKalendar',
	version: '2.0'
}

export class Builder implements IBuilder {
    private calendar: Calendar
    private formatter: Formatter
    private data: string[]

    constructor(calendar: Calendar = defaultCalendar) {
    	this.calendar = calendar
    	this.formatter = new Formatter()
    	this.data = []
    }

    public build(): string {
        
    	const { version, prodId, calscale, method, events } = this.calendar
    	// this.addTimeZones(timezones)
    	this.addEvents(events)
    	// this.addJournals(journals)
    	// this.addTodos(todos)
    	// this.addFreeBusyTimes(freebusy)
        
    	const data = this.data.join('\r\n')

    	return [
    		'BEGIN:VCALENDAR',
    		`VERSION:${version}`,
    		`PRODID:${prodId}`,
    		calscale ? `CALSCALE:${calscale}` : '',
    		method ? `METHOD:${method}` : '',
    		data,
    		'END:VCALENDAR\r\n',
    	].filter(Boolean).join('\r\n')
    }

    private add(value: string): void {
    	if (value !== '') {
    		this.data.push(value)
    	}
    }

    private addEvent(event: Event, fmt: Formatter): void {
    	this.add('BEGIN:VEVENT')
    	this.add(fmt.formatDate('DTSTAMP', event.dtStamp))
    	this.add(fmt.formatString('UID', event.uid))
    	this.add(fmt.formatDate('DTSTART', event.start))
    	this.add(fmt.formatString('CLASS', event.class))
    	this.add(fmt.formatDate('CREATED', event.created))
    	this.add(fmt.formatString('SUMMARY', event.summary))
    	this.add(fmt.formatString('DESCRIPTION', event.description))
    	this.add(fmt.formatGeo(event.geo))
    	this.add(fmt.formatDate('LAST-MODIFIED', event.lastModified))
    	this.add(fmt.formatString('LOCATION', event.location))
    	this.add(fmt.formatOrganizer(event.organizer))
    	this.add(fmt.formatString('PRIORITY', event.priority))
    	this.add(fmt.formatString('SEQUENCE', event.sequnce))
    	this.add(fmt.formatString('STATUS', event.status))
    	this.add(fmt.formatString('TRANSP', event.transp))
    	this.add(fmt.formatString('URL', event.url))
    	this.add(fmt.formatString('RECURRENCE-ID', event.recurrenceId))
    	this.add(fmt.formatRRule(event.rrule))
    	this.add(fmt.formatDate('DTEND', event.end))
    	this.add(fmt.formatDuration(event.duration, 'DURATION'))
    	this.add(fmt.formatAttachments(event.attachments))
    	this.add(fmt.formatAttendees(event.attendees))
    	this.add(fmt.formatStrings('CATEGORIES', event.categories))
    	this.add(fmt.formatString('COMMENT', event.comment))
    	this.add(fmt.formatString('CONTACT', event.contact))
    	this.add(fmt.formatDate('EXDATE', event.exdate))
    	this.add(fmt.formatRelations(event.relatedTo))
    	this.add(fmt.formatStrings('RESOURCES', event.resources))
    	this.add(fmt.formatRDate(event.rdate))
    	this.add(fmt.formatXprops(event.xProps))
    	this.addAlarms(event.alarms)
    	this.add('END:VEVENT')
    }

    private addAlarm(alarm: Alarm, fmt: Formatter): void {
    	this.add('BEGIN:VALARM')
    	this.add(fmt.formatString('ACTION', alarm.action))
    	this.add(fmt.formatTrigger(alarm.trigger))
    	this.add(fmt.formatDuration(alarm.duration, 'DURATION'))
    	this.add(fmt.formatString('REPEAT', alarm.repeat))
    	this.add(fmt.formatString('DESCRIPTION', alarm.description))
    	this.add(fmt.formatString('SUMMARY', alarm.summary))
    	this.add(fmt.formatAttendees(alarm.attendees))
    	this.add(fmt.formatAttachments(alarm.attachments))
    	this.add(fmt.formatXprops(alarm.xProps))
    	this.add('END:VALARM')
    }

    private addEvents(events: Event[] = []): void {
    	events.forEach(event => {
    		if (event.end && event.duration) {
    			throw new BuildingError('Event can\'t contain \'end\' and \'duration\' at the same time!')
    		}
			
    		if (!event.dtStamp) {
    			event.dtStamp = this.now()
    		}
			
    		this.addEvent(event, this.formatter)
    	})
    }

    private now(): string {
    	const now = new Date();
    	// Beautiful JS date formatting
    	return `${now.getFullYear()}${this.pad(now.getMonth() + 1)}${this.pad(now.getDate())}T${this.pad(now.getHours())}${this.pad(now.getMinutes())}${this.pad(now.getSeconds())}Z`
    }
	
    private pad(number: number): string {
    	return ('00' + number).substr(-2, 2)
    }
    
    private addAlarms(alarms: Alarm[] = []): void {
    	alarms.forEach(alarm => this.addAlarm(alarm, this.formatter))
    }
}

export default Builder
