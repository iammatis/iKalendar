import Formatter from './formatter'
import Calendar from './types/calendar'
import IBuilder from './types/classes/ibuilder'
import { Event, FreeBusy, Journal, TimeZone, Todo } from './types/components'

const defaultCalendar: Calendar = {
    prodId: 'iKalendar',
    version: '2.0'
}

export class Builder implements IBuilder {
    private formatter: Formatter

    constructor(calendar: Calendar = defaultCalendar) {
        this.formatter = new Formatter(calendar)
    }

    public addEvent(event: Event): void {
        this.addEvents([event])
    }

    public addEvents(events: Event[]): void {
        this.formatter.addEvents(events)
    }

    public addTodo(todo: Todo): void {
        this.addTodos([todo])
    }

    public addTodos(todos: Todo[]): void {
        throw new Error('Method not implemented.')
    }

    public addJournal(journal: Journal): void {
        this.addJournals([journal])
    }

    public addJournals(journals: Journal[]): void {
        throw new Error('Method not implemented.')
    }

    public addFreeBusy(freebusy: FreeBusy): void {
        this.addFreeBusyTimes([freebusy])
    }

    public addFreeBusyTimes(freebusy: FreeBusy[]): void {
        throw new Error('Method not implemented.')
    }

    public addTimeZone(timezone: TimeZone): void {
        this.addTimeZones([timezone])
    }

    public addTimeZones(timezones: TimeZone[]): void {
        throw new Error('Method not implemented.')
    }
}
