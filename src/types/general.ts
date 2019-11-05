// Descriptive Component Properties

export type Attachment = {
    type: string
    value: string
}

export type Classification = 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL'

export type GeoPosition = {
    lat: number
    lon: number
}

export type Status = EventStatus | TodoStatus | JournalStatus
export type EventStatus = 
    | 'TENTATIVE'
    | 'CONFIRMED'
    | 'CANCELLED'

export type TodoStatus = 
    | 'NEEDS-ACTION'
    | 'COMPLETED'
    | 'IN-PROCESS'
    | 'CANCELLED'

export type JournalStatus = 
    | 'DRAFT'
    | 'FINAL'
    | 'CANCELLED'



// Date and Time Component Properties

export type Duration = {
    week?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
}

export type Transparency = 'OPAQUE' | 'TRANSPARENT'



// Relationship Component Properties

export type Person = {
    cn?: string
    dir?: string
    sentBy?: string
}

export type CUType = 'INDIVIDUAL' | 'GROUP' | 'RESOURCE' | 'ROOM' | 'UNKNOWN'

export type Role = 'CHAIR' | 'REQ-PARTICIPANT' | 'OPT-PARTICIPANT' | 'NON-PARTICIPANT'

export type Partstat = PartstatEvent | PartstatTodo | PartstatJournal
export type PartstatBase = 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED'
export type PartstatEvent = PartstatBase | 'TENTATIVE' | 'DELEGATED'
export type PartstatTodo = PartstatBase | 'TENTATIVE' | 'DELEGATED' | 'COMPLETED' | 'IN-PROCESS'
export type PartstatJournal = PartstatBase

export type Attendee = {
    cu?: CUType
    member?: string | string[]
    role?: Role
    partstat?: Partstat
    rsvp?: boolean
    delegatedTo?: string | string[]
    delegatedFrom?: string | string[]
} & Person

export type Organizer = Person

export type RelationType = 'PARENT' | 'CHILD' | 'SIBLING'

export type Relation = {
    type: RelationType
    value: string
}



// Alarm Component Properties

export type ActionType = 'AUDIO' | 'DISPLAY' | 'EMAIL'

export type RelativeTrigger = {
    type?: 'START' | 'END'
    value: string | Duration
}

export type AbsoluteTrigger = {
    value: Date
}



// Miscellaneous Component Properties

export type XProp = {
    name: string
    value: string
}



// Other Properties

export type FreeBusyType = 'FREE' | 'BUSY' | 'BUSY-UNAVAILABLE' | 'BUSY-TENTATIVE'

export type PeriodExplicit = {
    start: Date
    end: Date
}

export type PeriodStart = {
    start: Date
    duration: string | Duration
}

export type Period = PeriodExplicit | PeriodStart

export type RDTType = 'DATE-TIME' | 'DATE' | 'PERIOD'
