# iKalendar

[![NPM](https://nodei.co/npm/ikalendar.png?compact=true)](https://nodei.co/npm/ikalendar/)

[![Build Status](https://travis-ci.org/iammatis/iKalendar.svg?branch=master)](https://travis-ci.org/iammatis/iKalendar)

**IMPORTANT: This is an early stage release and project structure can change greatly!**

Parser and builder for iCalendar ([RFC 5545](https://tools.ietf.org/html/rfc5545)) data format

## Table of Contents

- [Install](#install)
- [Usage](#usage)
    - [Builder](#builder)
    - [Parser](#parser)
- [Types](#types)
- [License](#license)
- [Credits](#credits)

## Install

```
npm instal ikalendar
```

## Usage


### Builder
```typescript
import { Builder, Calendar } from 'ikalendar'

const calendar: Calendar = {
    version: '2.0',
    prodId: 'Awesome project prodId',
    events: [
        {
            start: '20101231T083000Z',
            uid: 'uid1@example.com'
        }
    ]
}

const builder = new Builder(calendar)
builder.build()

// Returns:
// 
// BEGIN:VCALENDAR
// VERSION:2.0
// PRODID:Awesome project prodId
// BEGIN:VEVENT
// DTSTAMP:20101231T083000Z
// UID:uid1@example.com
// END:VEVENT
// END:VCALENDAR
```

### Parser
```typescript
import { Parser } from 'ikalendar'

const str = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:Awesome project prodId
BEGIN:VEVENT
DTSTAMP:20101231T083000Z
UID:uid1@example.com
END:VEVENT
END:VCALENDAR
`

const parser = new Parser()
parser.parse(str)

// Returns:
// 
// {
//     version: '2.0',
//     prodId: 'Awesome project prodId',
//     events: [
//         {
//             start: '20101231T083000Z',
//             uid: 'uid1@example.com'
//         }
//     ]
// }
```

## Components

**iKalendar** can generate `event`, `alarm` and `timezone` component.

### Timezone

Timezone component can be generated two ways:

1. By supplying all the necessary timezone information

```javascript
const builder = new Builder({
    version: '2.0',
    prodId: '-//RDU Software//NONSGML HandCal//EN',
    timezone: {
        tzId: 'America/New_York',
        tzUrl: 'http://tzurl.org/zoneinfo-outlook/America/New_York',
        standard: [
            {
                start: '19701101T020000',
                offsetFrom: '-0400',
                offsetTo: '-0500',
                tzName: 'EST',
                rrule: new RRule({
                    freq: RRule.YEARLY,
                    bymonth: 11,
                    byweekday: [ RRule.SU.nth(1) ]
                })
            }
        ],
        daylight: [
            {
                start: '19700308T020000',
                offsetFrom: '-0500',
                offsetTo: '-0400',
                tzName: 'EDT',
                rrule: new RRule({
                    freq: RRule.YEARLY,
                    bymonth: 3,
                    byweekday: [ RRule.SU.nth(2) ]
                })
            }
        ],
        xProps: [
            {
                name: 'LIC-LOCATION',
                value: 'America/New_York'
            }
        ]
    },
    events: [
        {
            uid: 'guid-1.example.com',
            description: 'Project XYZ Review Meeting',
            summary: 'XYZ Project Review',
            categories: [ 'MEETING' ],
            class: 'PUBLIC',
            dtStamp: '19980309T231000Z',
            created: '19980309T130000Z',
            start: { value: '19980312T083000', tzId: 'America/New_York' },
            end: { value: '19980312T093000', tzId: 'America/New_York' }
        }
    ]
})
```

2. By mentioning `tzId` in the event `start` attribute and not supplying any timezone information
```javascript
const builder = new Builder({
    version: '2.0',
    prodId: '-//RDU Software//NONSGML HandCal//EN',
    events: [
        {
            uid: 'guid-1.example.com',
            description: 'Project XYZ Review Meeting',
            summary: 'XYZ Project Review',
            categories: [ 'MEETING' ],
            class: 'PUBLIC',
            dtStamp: '19980309T231000Z',
            created: '19980309T130000Z',
            start: { value: '19980312T083000', tzId: 'America/New_York' },
            end: { value: '19980312T093000', tzId: 'America/New_York' }
        }
    ]
})
```

Both will generate the same output:
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RDU Software//NONSGML HandCal//EN
BEGIN:VTIMEZONE
TZID:America/New_York
TZURL:http://tzurl.org/zoneinfo-outlook/America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:19980309T231000Z
UID:guid-1.example.com
DTSTART;TZID=America/New_York:19980312T083000
CLASS:PUBLIC
CREATED:19980309T130000Z
SUMMARY:XYZ Project Review
DESCRIPTION:Project XYZ Review Meeting
DTEND;TZID=America/New_York:19980312T093000
CATEGORIES:MEETING
END:VEVENT
END:VCALENDAR
```

## Types

### Date

iCal format supports multiple different [Date](https://tools.ietf.org/html/rfc5545#section-3.3.4)/[Date-Time](https://tools.ietf.org/html/rfc5545#section-3.3.5) formats, iKalendar (for now) expects you to to supply it with valid iCalendar format. It won't take care of any kind of parsing or formatting. 

I'll use `DTSTART` property for this example. You can create this property multiple ways:

1. Plain string:
    ```js
    start:'19980118T230000'
    // DTSTART:19980118T230000
    ```
2. Object ([ComplexDate](https://github.com/iammatis/iKalendar/blob/master/src/types/general.ts#L45)) with following attributes: 
    ```ts
    type ComplexDate = {
        type?: 'DATE-TIME' | 'DATE'
        tzId?: string
        value: string
    }
    ```
    * Passing `tzId`
    ```js
    start:{value: '19980118T025436', tzId: 'America/Los_Angeles'}
    // DTSTART;TZID=America/Los_Angeles:20200217T025436
    ```
    * You can also specify `type: 'DATE'`
    ```js
    start:{value: '19980118', type: 'DATE'}
    // DTSTART:19980118
    ```
    * Or use all three attributes:
    ```js
    start:{value: '19980301T090000', type: 'DATE-TIME', tzId: 'Europe/Bratislava'}
    // DTSTART;VALUE=DATE-TIME;TZID=Europe/Bratislava:19980301T090000
    ```

## Credits

This library uses regex used in [iCalendar Ruby library](https://github.com/icalendar/icalendar).

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
