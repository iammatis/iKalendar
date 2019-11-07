import Builder from './builder'
import Calendar from './types/calendar'
import IKalendarInterface from './types/classes/ikalendar'
import { Event, FreeBusy, Journal, TimeZone, Todo } from './types/components'

const defaultCalendar: Calendar = {
    prodId: 'iKalendar',
    version: '2.0'
}

export class IKalendar implements IKalendarInterface {
    public calendar: Calendar
    public builder: Builder

    constructor(calendar: Calendar = defaultCalendar) {
        this.calendar = calendar
        this.builder = new Builder()
    }

    public createEvent(event: Event): string {
        return this.createEvents([event])
    }

    public createEvents(events: Event[]): string {
        this.builder.appendEvents(events)
        return this.builder.build()
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
