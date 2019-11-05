import {Classification, GeoPosition, Organizer, Transparency, Duration, Attachment, Attendee, Relation, XProp, Status, RDTType, Period} from '../general';
import Alarm from './alarm';

type Event = {
    dtStamp: Date;
    uid: string;
    start?: string;
    class?: Classification;
    created?: Date;
    description?: Date;
    geo?: GeoPosition;
    lastModified?: Date;
    location?: string;
    organizer?: Organizer;
    priority?: number;
    sequnce?: number;
    status?: Status;
    summary?: string;
    transp?: Transparency;
    url?: string;
    recurencceId?: string;
    rrule?: string;
    end?: Date;
    duration?: Duration;
    attach?: Attachment[];
    attendee?: Attendee[];
    categories?: string[];
    comment?: string;
    contact?: string;
    exdate?: Date;
    relatedTo?: Relation[];
    resources?: string[];
    rdate?: { type?: RDTType; value: (Date | Period)[]; tzId?: string; };
    xProps?: XProp[];
    alarm?: Alarm[];
}

export default Event
