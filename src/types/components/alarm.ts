import { ActionType, Attachment, Attendee, Duration, Trigger, XProp } from '../general'

type Alarm = {
    action: ActionType
    trigger: Trigger
    duration?: Duration
    repeat?: number
    description?: string
    summary?: string
    attendees?: Attendee[]
    attachments?: Attachment[]
    xProps?: XProp[]
}

export default Alarm
