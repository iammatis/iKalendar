import { stripIndents } from 'common-tags'

import Formatter from '../src/formatter'
import Calendar from '../src/types/calendar'
import { Event } from '../src/types/components'
import { Attachment, Attendee, Duration, Organizer, Relation, Trigger, XProp } from '../src/types/general'

let formatter: Formatter
const defaultCalendar: Calendar = {
    prodId: 'iKalendar',
    version: '2.0'
}

describe('Test Formatter Class', () => {

    beforeEach(() => {
        formatter = new Formatter(defaultCalendar)
    })

    describe('Test general properties', () => {
    
        it('Test add', () => {
            formatter.add('test string')
            expect(formatter.format()).toEqual('test string')
        })
    
        it('Test add empty string', () => {
            formatter.addString('ATTRNAME')
            expect(formatter.format()).toEqual('')
        })
    
        it('Test add string', () => {
            formatter.addString('ATTRNAME', 'string')
            expect(formatter.format()).toEqual('ATTRNAME:string')
        })
    
        it('Test add multiple empty strings', () => {
            formatter.addStrings('ATTRNAME', [])
            expect(formatter.format()).toEqual([])
        })
    
        it('Test add multiple strings', () => {
            formatter.addStrings('ATTRNAME', ['string-one', 'string-two'])
            expect(formatter.format()).toEqual('ATTRNAME:string-one,string-two')
        })
    
        it('Test add number', () => {
            formatter.addNumber('ATTRNAME', 0)
            expect(formatter.format()).toEqual('ATTRNAME:0')
        })
    
        it('Test add simple date-time', () => {
            formatter.addDate('ATTRNAME', '2019-11-06T16:08:03Z')
            expect(formatter.format()).toEqual('ATTRNAME:20191106T170803')
        })

        it('Test add complex date-time', () => {
            formatter.addDate('ATTRNAME', { value: '19971102', tzId: 'Europe/Bratislava' })
            expect(formatter.format()).toEqual('ATTRNAME;TZID=Europe/Bratislava:19971102T000000')
        })

        it('Test add complex date', () => {
            formatter.addDate('ATTRNAME', { value: '19971102', type: 'DATE', tzId: 'Europe/Bratislava' })
            expect(formatter.format()).toEqual('ATTRNAME;VALUE=DATE;TZID=Europe/Bratislava:19971102')
        })

        it('Test add simple recurring date-time', () => {
            formatter.addRDate({ dates: ['2019-11-06T16:08:03Z'] })
            expect(formatter.format()).toEqual('RDATE:20191106T170803')
        })

        it('Test add multiple recurring date-times with timezone', () => {
            formatter.addRDate({ dates: ['2019-11-06T16:08:03Z', '2018-12-16T11:18:23Z'], tzId: 'Europe/Bratislava' })
            expect(formatter.format()).toEqual('RDATE;TZID=Europe/Bratislava:20191106T170803,20181216T121823')
        })

        it('Test add simple recurring date', () => {
            formatter.addRDate({ type: 'DATE', dates: ['19971102']})
            expect(formatter.format()).toEqual('RDATE;VALUE=DATE:19971102')
        })

        it('Test add multiple recurring dates', () => {
            formatter.addRDate({ type: 'DATE', dates: ['19971102', '19991222']})
            expect(formatter.format()).toEqual('RDATE;VALUE=DATE:19971102,19991222')
        })

        it('Test add simple recurring period', () => {
            formatter.addRDate({
                type: 'PERIOD',
                periods: [{ start: '19960403T020000Z', end: '19960403T040000Z' }]
            })
            expect(formatter.format()).toEqual('RDATE;VALUE=PERIOD:19960403T040000/19960403T060000')
        })

        it('Test add multiple recurring periods with timezone', () => {
            formatter.addRDate({
                type: 'PERIOD',
                tzId: 'Europe/Bratislava',
                periods: [
                    { start: '19960403T020000Z', end: '19960403T040000Z' },
                    { start: '19960404T010000Z', duration: { hour: 3 }}
                ]
            })
            expect(formatter.format()).toEqual('RDATE;TZID=Europe/Bratislava;VALUE=PERIOD:19960403T040000/19960403T060000,19960404T030000/PT3H')
        })
    
        it('Test add geo position', () => {
            formatter.addGeoPosition({ lat: 240, lon: 420 })
            expect(formatter.format()).toEqual('GEO:240;420')
        })
    
        
        it('Test add simple organizer', () => {
            const organizer: Organizer = {
                address: 'mailto:jsmith@example.com'
            }
            formatter.addOrganizer(organizer)
            expect(formatter.format()).toEqual('ORGANIZER:mailto:jsmith@example.com')
        })
    
        it('Test add complex organizer', () => {
            const organizer: Organizer = {
                address: 'mailto:jsmith@example.com',
                cn: 'JohnSmith',
                dir: 'ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith)',
                sentBy: '"mailto:jane_doe@example.com"'
            }
            formatter.addOrganizer(organizer)
            expect(formatter.format()).toEqual('ORGANIZER;CN=JohnSmith;DIR=ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith);CN="mailto:jane_doe@example.com":mailto:jsmith@example.com')
        })
    
        it('Test add duration', () => {
            const duration: Duration = {
                before: true,
                hour: 5,
                minute: 30
            }
            formatter.addDuration(duration)
            expect(formatter.format()).toEqual('DURATION:-PT5H30M')
        })
    
        it('Test add attachment', () => {
            const attach: Attachment = {
                type: 'audio/basic',
                value: 'ftp://example.com/pub/'
            }
            formatter.addAttachment(attach)
            expect(formatter.format()).toEqual('ATTACH;FMPTYPE=audio/basic:ftp://example.com/pub/')
        })
    
        it('Test add multiple attachments', () => {
            const attach: Attachment[] = [
                {
                    value: 'http://example.com/public/quarterly-report.doc'
                },
                {
                    type: 'application/msword',
                    value: 'ftp://example.com/pub/docs/agenda.doc'
                }
            ]
            formatter.addAttachments(attach)
            expect(formatter.format()).toEqual([
                'ATTACH:http://example.com/public/quarterly-report.doc',
                'ATTACH;FMPTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc'
            ])
        })
    
        it('Test add simple attendee', () => {
            const attendee: Attendee = {
                address: 'mailto:john_public@example.com'
            }
            formatter.addAttendee(attendee)
            expect(formatter.format()).toEqual('ATTENDEE:mailto:john_public@example.com')
        })
    
        it('Test add complex attendee', () => {
            const attendee: Attendee = {
                address: 'mailto:john_public@example.com',
                cn : 'Henry Cabot',
                dir : '',
                sentBy : '',
                cu: 'GROUP',
                member: ['"mailto:projectA@example.com"', '"mailto:projectB@example.com"'],
                role: 'REQ-PARTICIPANT',
                partstat: 'ACCEPTED',
                rsvp: true,
                delegatedTo: ['"mailto:jdoe@example.com"', '"mailto:jqpublic@example.com"'],
                delegatedFrom: ['"mailto:jsmith@example.com"']
            }
            formatter.addAttendee(attendee)
            expect(formatter.format()).toEqual('ATTENDEE;CN=Henry Cabot;CUTYPE=GROUP;MEMBER="mailto:projectA@example.com","mailto:projectB@example.com";ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=true;DELEGATED-TO="mailto:jdoe@example.com","mailto:jqpublic@example.com";DELEGATED-FROM="mailto:jsmith@example.com":mailto:john_public@example.com')
        })
    
        it('Test add multiple simple attendees', () => {
            const attendees: Attendee[] = [
                {
                    address: 'mailto:john_public@example.com'
                },
                {
                    address: 'mailto:joecool@example.com'
                }
            ]
            formatter.addAttendees(attendees)
            expect(formatter.format()).toEqual(stripIndents`
                ATTENDEE:mailto:john_public@example.com
                ATTENDEE:mailto:joecool@example.com
            `)
        })
    
        it('Test add simple relation', () => {
            const relation: Relation = {
                value: 'jsmith.part7.19960817T083000.xyzMail@example.com'
            }
            formatter.addRelation(relation)
            expect(formatter.format()).toEqual('RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com')
        })
    
        it('Test add complex relation', () => {
            const relation: Relation = {
                type: 'SIBLING',
                value: '19960401-080045-4000F192713@example.com'
            }
            formatter.addRelation(relation)
            expect(formatter.format()).toEqual('RELATED-TO;RELTYPE=SIBLING:19960401-080045-4000F192713@example.com')
        })
    
        it('Test add multiple relations', () => {
            const relations: Relation[] = [
                {
                    type: 'SIBLING',
                    value: '19960401-080045-4000F192713@example.com'
                },
                {
                    value: 'jsmith.part7.19960817T083000.xyzMail@example.com'
                }
            ]
            formatter.addRelations(relations)
            expect(formatter.format()).toEqual(stripIndents`
                RELATED-TO;RELTYPE=SIBLING:19960401-080045-4000F192713@example.com
                RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com
            `)
        })
    
        it('Test add simple datetime trigger', () => {
            const trigger: Trigger = {
                value: '19980403T120000Z'
            }
            formatter.addTrigger(trigger)
            expect(formatter.format()).toEqual('TRIGGER:19980403T140000')
        })
    
        it('Test add simple duration trigger', () => {
            const trigger: Trigger = {
                value: {
                    week: 2,
                    day: 4
                }
            }
            formatter.addTrigger(trigger)
            expect(formatter.format()).toEqual('TRIGGER:P2W4D')
        })
    
        it('Test add complex datetime trigger', () => {
            const trigger: Trigger = {
                related: 'START',
                value: '19980403T120000Z'
            }
            formatter.addTrigger(trigger)
            expect(formatter.format()).toEqual('TRIGGER;RELATED=START:19980403T140000')
        })
    
        it('Test add complex duration trigger', () => {
            const trigger: Trigger = {
                related: 'START',
                value: {
                    week: 2,
                    day: 4
                }
            }
            formatter.addTrigger(trigger)
            expect(formatter.format()).toEqual('TRIGGER;RELATED=START:P2W4D')
        })
    
        it('Test add xProp', () => {
            const xProp: XProp = {
                name: 'IKALENDAR-PROP',
                value: 'Matej Vilk'
            }
            formatter.addXprop(xProp)
            expect(formatter.format()).toEqual('X-IKALENDAR-PROP:Matej Vilk')
        })
    
        it('Test add multiple xProps', () => {
            const xProps: XProp[] = [
                {
                    name: 'IKALENDAR-PROP1',
                    value: 'Matej Vilk'
                },
                {
                    name: 'IKALENDAR-PROP2',
                    value: 'Matej Vilk'
                }
            ]
            formatter.addXprops(xProps)
            expect(formatter.format()).toEqual(
                'X-IKALENDAR-PROP1:Matej Vilk\r\nX-IKALENDAR-PROP2:Matej Vilk'
            )
        })
    })

    describe('Test components', () => {
        it('Test add Event', () => {
            const event: Event = {
                dtStamp: '2010-10-20',
                uid: '123',
                start: '1995-12-25',
                class: 'PUBLIC',
                created: '2013-02-08T09',
                description: 'Event\'s description',
                geo: { lat: 240, lon: 420 },
                lastModified: '2013-02-08 07:00',
                location: 'Event\'s location',
                organizer: {
                    address: 'mailto:mrbig@example.com'
                },
                priority: 0,
                sequnce: 1,
                status: 'DRAFT',
                summary: 'Event\'s summary',
                transp: 'TRANSPARENT',
                url: 'url',
                recurrenceId: '456',
                rrule: '',
                duration: {hour: 8, minute: 45},
                attachments: [
                    {
                        type: 'application/postscript',
                        value: 'ftp://example.com/pub/conf/bkgrnd.ps'
                    }
                ],
                attendees: [
                    {
                        address: 'mailto:jsmith@example.com'
                    }
                ],
                categories: ['Project Report', 'XYZ', 'Weekly Meeting'],
                comment: 'Event\'s comment',
                contact: 'Contact',
                exdate: '1995-12-25',
                relatedTo: [
                    {
                        value: 'jsmith.part7.19960817T083000.xyzMail@example.com'
                    }
                ],
                resources: ['Nettoyeur haute pression'],
                // rdate: [],
                xProps: [
                    {
                        name: 'IKALENDAR-PROP1',
                        value: 'Matej Vilk'
                    }
                ],
                alarms: [
                    {
                        action: 'AUDIO',
                        trigger: {
                            value: {
                                week: 20,
                                day: 365
                            }
                        }
                    }
                ],

            }
            
            formatter.addEvent(event)
            expect(formatter.format()).toStrictEqual(stripIndents`
                BEGIN:VEVENT
                DTSTAMP:20101020T000000
                UID:123
                DTSTART:19951225T000000
                CLASS:PUBLIC
                CREATED:20130208T090000
                DESCRIPTION:Event\'s description
                GEO:240;420
                LAST-MODIFIED:20130208T070000
                LOCATION:Event\'s location
                ORGANIZER:mailto:mrbig@example.com
                PRIORITY:0
                SEQUENCE:1
                STATUS:DRAFT
                SUMMARY:Event\'s summary
                TRANSP:TRANSPARENT
                URL:url
                RECURRENCE-ID:456
                DURATION:PT8H45M
                ATTACH;FMPTYPE=application/postscript:ftp://example.com/pub/conf/bkgrnd.ps
                ATTENDEE:mailto:jsmith@example.com
                CATEGORIES:Project Report,XYZ,Weekly Meeting
                COMMENT:Event\'s comment
                CONTACT:Contact
                EXDATE:19951225T000000
                RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com
                RESOURCES:Nettoyeur haute pression
                X-IKALENDAR-PROP1:Matej Vilk
                BEGIN:VALARM
                ACTION:AUDIO
                TRIGGER:P20W365D
                END:VALARM
                END:VEVENT
            `)
        })
    })

})
