import { Attachment, XProp, Attendee, ActionType, RelativeTrigger, AbsoluteTrigger, Duration } from '../general'

type Alarm = AudioAlarm | DisplayAlarm | EmailAlarm

export type AudioAlarm = {
    action: ActionType
    trigger: RelativeTrigger | AbsoluteTrigger
    duration?: Duration
    repeat?: number
    attach?: Attachment
    xProps?: XProp[]
}

export type DisplayAlarm = {
    action: ActionType
    trigger: RelativeTrigger | AbsoluteTrigger
    description: string
    duration?: Duration
    repeat?: number
    xProps?: XProp[]
}

export type EmailAlarm = {
    action: ActionType
    trigger: RelativeTrigger | AbsoluteTrigger
    description: string
    summary: string
    attendee: Attendee[]
    duration?: Duration
    repeat?: number
    attach?: Attachment[]
    xProps?: XProp[]
}

export default Alarm
