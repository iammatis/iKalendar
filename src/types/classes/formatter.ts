import { Alarm, Event, FreeBusy, Journal, TimeZone, Todo } from "../components"

interface IFormatter {
    format(): string

    addEvent(event?: Event): void
    addEvents(events?: Event[]): void

    addTodo(todo?: Todo): void
    addTodos(todo?: Todo[]): void

    addJournal(journal?: Journal): void
    addJournals(journals?: Journal[]): void

    addFreeBusy(freebusy?: FreeBusy): void
    addFreeBusys(freebusy?: FreeBusy[]): void

    addTimeZone(timeZone?: TimeZone): void
    addTimeZones(timeZones?: TimeZone[]): void

    addAlarm(alarm?: Alarm): void
    addAlarms(alarms?: Alarm[]): void
}

export default IFormatter
