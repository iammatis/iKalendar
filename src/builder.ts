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

    constructor(calendar: Calendar = defaultCalendar, withCalendar: boolean = true) {
        this.formatter = new Formatter(calendar, withCalendar)
    }

    public createEvent(event: Event): string {
        return this.createEvents([event])
    }

    public createEvents(events: Event[]): string {
        this.formatter.addEvents(events)
        return this.formatter.format()
    }

    public createTodo(todo: Todo): string {
        return this.createTodos([todo])
    }

    public createTodos(todos: Todo[]): string {
        throw new Error('Method not implemented.')
    }

    public createJournal(journal: Journal): string {
        return this.createJournals([journal])
    }

    public createJournals(journals: Journal[]): string {
        throw new Error('Method not implemented.')
    }

    public createFreeBusy(freebusy: FreeBusy): string {
        return this.createFreeBusys([freebusy])
    }

    public createFreeBusys(freebusy: FreeBusy[]): string {
        throw new Error('Method not implemented.')
    }

    public createTimeZone(timezone: TimeZone): string {
        return this.createTimeZones([timezone])
    }

    public createTimeZones(timezones: TimeZone[]): string {
        throw new Error('Method not implemented.')
    }
}
