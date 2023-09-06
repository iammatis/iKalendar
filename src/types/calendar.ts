import { Event, FreeBusy, Journal, TimeZone, Todo } from './components'
import { Duration, XProp } from './general'

export type Calendar = {
    prodId: string
    version: string
    refreshInterval?: Duration
    calscale?: string
    method?: string
    xProps?: XProp[]
    color?: string
    
    events?: Event[]
    todos?: Todo[]
    journals?: Journal[]
    freebusy?: FreeBusy[]
    timezone?: TimeZone
}
