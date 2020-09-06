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

const parser = new Parser(str)
parser.parse()

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

## Types

### Date

iCal format supports multiple different [Date](https://tools.ietf.org/html/rfc5545#section-3.3.4)/[Date-Time](https://tools.ietf.org/html/rfc5545#section-3.3.5) formats, iKalendar gives you opportunity to use any of them with some restrictions.

I'll use `DTSTART` property for this example. You can create this property multiple ways:

1. Plain string:
    * In iCal local time format `'YYYYMMDDTHHmmss'`
        ```js
        start:'19980118T230000'
        // DTSTART:19980118T230000
        ```
    * Any other [moment.js](https://momentjs.com/docs/) recognizable format, gets parsed to UTC
        ```js
        start:'1998-01-18T09:00:00+0200'
        // DTSTART:19980118T070000Z
        ```
2. Object ([ComplexDate](https://github.com/iammatis/iKalendar/blob/master/src/types/general.ts#L45)) with following attributes: 
    ```ts
    type ComplexDate = {
        type?: 'DATE-TIME' | 'DATE'
        tzId?: string
        value: string
    }
    ```
    * Passing `tzId` keeps time in that timezone
    ```js
    start:{value: '1998-01-18T02:54:36-08:00', tzId: 'America/Los_Angeles'}
    // DTSTART;TZID=America/Los_Angeles:20200217T025436
    ```
    * Passing only `value` converts it once again to UTC
    ```js
    start:{value: '1998-01-18T09:00:00+0200'}
    // DTSTART:19980118T070000Z
    ```
    * You can also specify `type: 'DATE'`
    ```js
    start:{value: '1998-01-18T23:00:00', type: 'DATE'}
    // DTSTART:19980118
    ```
    * Or use all three attributes:
    ```js
    start:{value: '1998-03-01T09:00:00+0100', type: 'DATE-TIME', tzId: 'Europe/Bratislava'}
    // DTSTART;VALUE=DATE-TIME;TZID=Europe/Bratislava:19980301T090000
    ```

## Credits

This library uses regex used in [iCalendar Ruby library](https://github.com/icalendar/icalendar).

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
