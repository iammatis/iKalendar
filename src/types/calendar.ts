import { XProp } from './general'

type Calendar = {
    prodId: string
    version: string
    calscale?: string
    method?: string
    xProps?: XProp[]
}

export default Calendar
