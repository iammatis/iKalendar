# iKalendar

[![NPM](https://nodei.co/npm/ikalendar.png?compact=true)](https://nodei.co/npm/ikalendar/)

[![Build Status](https://travis-ci.org/iammatis/iKalendar.svg?branch=master)](https://travis-ci.org/iammatis/iKalendar)

**IMPORTANT: This is an early stage release and project structure can change greatly!**

Parser and builder for iCalendar data format

## Table of Contents

- [Install](#install)
- [Usage](#usage)
    - [Builder](#builder)
    - [Parser](#parser)

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

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
