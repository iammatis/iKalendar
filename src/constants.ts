const propertiesRegistry: Record<string, string> = {
	'CALSCALE': 'calscale',
	'METHOD': 'method',
	'PRODID': 'prodId',
	'VERSION': 'version',
	'ATTACH': 'attachments',
	'CATEGORIES': 'categories',
	'CLASS': 'class',
	'COMMENT': 'comment',
	'DESCRIPTION': 'description',
	'GEO': 'geto',
	'LOCATION': 'location',
	'PERCENT-COMPLETE': 'percentComplete',
	'PRIORITY': 'priority',
	'RESOURCES': 'resources',
	'STATUS': 'status',
	'SUMMARY': 'summary',
	'COMPLETED': 'completed',
	'DTEND': 'end',
	'DUE': 'dur',
	'DTSTART': 'start',
	'DURATION': 'duration',
	'FREEBUSY': 'freebusy',
	'TRANSP': 'transp',
	'TZID': 'tzId',
	'TZNAME': 'tzName',
	'TZOFFSETFROM': 'offsetFrom',
	'TZOFFSETTO': 'offsetTo',
	'TZURL': 'tzUrl',
	'ATTENDEE': 'attendees',
	'CONTACT': 'contact',
	'ORGANIZER': 'organizer',
	'RECURRENCE-ID': 'reccurenceId',
	'RELATED-TO': 'relatedTo',
	'URL': 'url',
	'COLOR': 'color',
	'UID': 'uid',
	'EXDATE': 'exdate',
	'EXRULE': 'exRule',
	'RDATE': 'rDate',
	'RRULE': 'rrule',
	'ACTION': 'action',
	'REPEAT': 'repeat',
	'TRIGGER': 'trigger',
	'CREATED': 'created',
	'DTSTAMP': 'dtStamp',
	'LAST-MODIFIED': 'lastModified',
	'SEQUENCE': 'sequence',
	'REQUEST-STATUS': 'rStatus',
	'REFRESH-INTERVAL': 'refreshInterval',
	'X-PROPS': 'xProps'
}

const arrayAttributes = [
	'events',
	'alarms',
	'todos',
	'journals',
	'standard',
	'daylight',
	'freebusy',
	'attendees',
	'xProps'
]

const componentsRegistry: Record<string, string> = {
	'VEVENT': 'events',
	'VALARM': 'alarms',
	'VTODO': 'todos',
	'VJOURNAL': 'journals',
	'VTIMEZONE': 'timezone',
	'STANDARD': 'standard',
	'DAYLIGHT': 'daylight',
	'VFREEBUSY': 'freebusy'
}


export {
	propertiesRegistry,
	componentsRegistry,
	arrayAttributes
}
