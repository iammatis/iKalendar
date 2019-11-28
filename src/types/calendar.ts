import { Event, FreeBusy, Journal, TimeZone, Todo } from './components'
import { XProp } from './general'

export type Calendar = {
    prodId: string
    version: string
    calscale?: string
    method?: string
    xProps?: XProp[]
    
    events?: Event[]
    todos?: Todo[]
    journals?: Journal[]
    freebusy?: FreeBusy[]
    timezones?: TimeZone[]
}
