// Descriptive Component Properties

export type Attachment = {
    type?: string
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
    isNegative?: boolean
    week?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
}

export type ComplexDate = {
    type?: 'DATE-TIME' | 'DATE'
    tzId?: string
    value: string
}

export type RecurrenceDate = {
    type?: RDTType
    tzId?: string
    dates?: string[]
    periods?: Period[]
}

export type Period = {
    start: string
    end?: string
    duration?: Duration
}

export type RDTType = 'DATE-TIME' | 'DATE' | 'PERIOD'

export type Transparency = 'OPAQUE' | 'TRANSPARENT'



// Relationship Component Properties

export type Person = {
    address: string
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
    member?: string[]
    role?: Role
    partstat?: Partstat
    rsvp?: boolean
    delegatedTo?: string[]
    delegatedFrom?: string[]
} & Person

export type Organizer = Person

export type RelationType = 'PARENT' | 'CHILD' | 'SIBLING'

export type Relation = {
    type?: RelationType
    value: string
}



// Alarm Component Properties

export type ActionType = 'AUDIO' | 'DISPLAY' | 'EMAIL'

export type Trigger = {
    related?: 'START' | 'END'
    value: string | Duration
}



// Miscellaneous Component Properties

export type XProp = {
    name: string
    value: string
}



// Other Properties

export type FreeBusyType = 'FREE' | 'BUSY' | 'BUSY-UNAVAILABLE' | 'BUSY-TENTATIVE'
