import { Event, FreeBusy, Journal, TimeZone, Todo } from '../components'

interface IBuilder {
    addEvent(event: Event): void

    addEvents(events: Event[]): void

    addTodo(todo: Todo): void

    addTodos(todos: Todo[]): void

    addJournal(journal: Journal): void

    addJournals(journals: Journal[]): void

    addFreeBusy(freebusy: FreeBusy): void

    addFreeBusyTimes(freebusy: FreeBusy[]): void

    addTimeZone(timezone: TimeZone): void

    addTimeZones(timezones: TimeZone[]): void
}

export default IBuilder
