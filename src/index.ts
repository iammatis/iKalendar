import IKalendarInterface from './types/classes/ikalendar';
import { Event, Todo, Journal, FreeBusy, TimeZone } from './types/components';
import Calendar from './types/calendar';

const defaultCalendar: Calendar = {
    version: '2.0',
    prodId: 'iKalendar'
}

export class IKalendar implements IKalendarInterface {
    calendar: Calendar;

    constructor(calendar: Calendar = defaultCalendar) {
        this.calendar = calendar
    }

    createEvent(event: Event): string {
        throw new Error('Method not implemented.');
    }

    createEvents(events: Event[]): string {
        throw new Error('Method not implemented.');
    }

    createTodo(todo: Todo): string {
        throw new Error('Method not implemented.');
    }

    createTodos(todos: Todo[]): string {
        throw new Error('Method not implemented.');
    }

    createJournal(journal: Journal): string {
        throw new Error('Method not implemented.');
    }

    createJournals(journals: Journal[]): string {
        throw new Error('Method not implemented.');
    }

    createFreeBusy(freebusy: FreeBusy): string {
        throw new Error('Method not implemented.');
    }

    createFreeBusys(freebusy: FreeBusy[]): string {
        throw new Error('Method not implemented.');
    }

    createTimeZone(timezone: TimeZone): string {
        throw new Error('Method not implemented.');
    }

    createTimeZones(timezones: TimeZone[]): string {
        throw new Error('Method not implemented.');
    }
}
