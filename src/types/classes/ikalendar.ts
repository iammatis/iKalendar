import {Event, Todo, Journal, FreeBusy, TimeZone} from '../components';
import Calendar from '../calendar';

interface IKalendarInterface {
    calendar: Calendar
    
    createEvent(event: Event): string

    createEvents(events: Event[]): string

    createTodo(todo: Todo): string

    createTodos(todos: Todo[]): string

    createJournal(journal: Journal): string

    createJournals(journals: Journal[]): string

    createFreeBusy(freebusy: FreeBusy): string

    createFreeBusys(freebusy: FreeBusy[]): string

    createTimeZone(timezone: TimeZone): string

    createTimeZones(timezones: TimeZone[]): string
}

export default IKalendarInterface
