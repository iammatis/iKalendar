import Builder from '../src/builder'
import { Event } from '../src/types/components'
import { Attachment, Attendee, Duration, Organizer, Relation, Trigger, XProp } from '../src/types/general'

let builder: Builder

describe('Test Builder Class', () => {

    beforeEach(() => {
        builder = new Builder()
    })

    describe('Test general properties', () => {
    
        it('Test append', () => {
            builder.append('test string')
            expect(builder.array).toStrictEqual(['test string'])
        })
    
        it('Test append empty string', () => {
            builder.appendString('ATTRNAME')
            expect(builder.array).toEqual([])
        })
    
        it('Test append string', () => {
            builder.appendString('ATTRNAME', 'string')
            expect(builder.array).toEqual(['ATTRNAME:string'])
        })
    
        it('Test append multiple empty strings', () => {
            builder.appendStrings('ATTRNAME', [])
            expect(builder.array).toEqual([])
        })
    
        it('Test append multiple strings', () => {
            builder.appendStrings('ATTRNAME', ['string-one', 'string-two'])
            expect(builder.array).toEqual(['ATTRNAME:string-one,string-two'])
        })
    
        it('Test append number', () => {
            builder.appendNumber('ATTRNAME', 0)
            expect(builder.array).toEqual(['ATTRNAME:0'])
        })
    
        it('Test append simple date-time', () => {
            builder.appendDate('ATTRNAME', '2019-11-06T16:08:03Z')
            expect(builder.array).toEqual(['ATTRNAME:20191106T170803'])
        })

        it('Test append complex date-time', () => {
            builder.appendDate('ATTRNAME', { value: '19971102', tzId: 'Europe/Bratislava' })
            expect(builder.array).toEqual(['ATTRNAME;TZID=Europe/Bratislava:19971102T000000'])
        })

        it('Test append complex date', () => {
            builder.appendDate('ATTRNAME', { value: '19971102', type: 'DATE', tzId: 'Europe/Bratislava' })
            expect(builder.array).toEqual(['ATTRNAME;VALUE=DATE;TZID=Europe/Bratislava:19971102'])
        })

        it('Test append simple recurring date-time', () => {
            builder.appendRDate({ dates: ['2019-11-06T16:08:03Z'] })
            expect(builder.array).toEqual(['RDATE:20191106T170803'])
        })

        it('Test append multiple recurring date-times with timezone', () => {
            builder.appendRDate({ dates: ['2019-11-06T16:08:03Z', '2018-12-16T11:18:23Z'], tzId: 'Europe/Bratislava' })
            expect(builder.array).toEqual(['RDATE;TZID=Europe/Bratislava:20191106T170803,20181216T121823'])
        })

        it('Test append simple recurring date', () => {
            builder.appendRDate({ type: 'DATE', dates: ['19971102']})
            expect(builder.array).toEqual(['RDATE;VALUE=DATE:19971102'])
        })

        it('Test append multiple recurring dates', () => {
            builder.appendRDate({ type: 'DATE', dates: ['19971102', '19991222']})
            expect(builder.array).toEqual(['RDATE;VALUE=DATE:19971102,19991222'])
        })

        it('Test append simple recurring period', () => {
            builder.appendRDate({
                type: 'PERIOD',
                periods: [{ start: '19960403T020000Z', end: '19960403T040000Z' }]
            })
            expect(builder.array).toEqual(['RDATE;VALUE=PERIOD:19960403T040000/19960403T060000'])
        })

        it('Test append multiple recurring periods with timezone', () => {
            builder.appendRDate({
                type: 'PERIOD',
                tzId: 'Europe/Bratislava',
                periods: [
                    { start: '19960403T020000Z', end: '19960403T040000Z' },
                    { start: '19960404T010000Z', duration: { hour: 3 }}
                ]
            })
            expect(builder.array).toEqual(['RDATE;TZID=Europe/Bratislava;VALUE=PERIOD:19960403T040000/19960403T060000,19960404T030000/PT3H'])
        })
    
        it('Test append geo position', () => {
            builder.appendGeoPosition({ lat: 240, lon: 420 })
            expect(builder.array).toEqual(['GEO:240;420'])
        })
    
        
        it('Test append simple organizer', () => {
            const organizer: Organizer = {
                address: 'mailto:jsmith@example.com'
            }
            builder.appendOrganizer(organizer)
            expect(builder.array).toEqual(['ORGANIZER:mailto:jsmith@example.com'])
        })
    
        it('Test append complex organizer', () => {
            const organizer: Organizer = {
                address: 'mailto:jsmith@example.com',
                cn: 'JohnSmith',
                dir: 'ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith)',
                sentBy: '"mailto:jane_doe@example.com"'
            }
            builder.appendOrganizer(organizer)
            expect(builder.array).toEqual(['ORGANIZER;CN=JohnSmith;DIR=ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith);CN="mailto:jane_doe@example.com":mailto:jsmith@example.com'])
        })
    
        it('Test append duration', () => {
            const duration: Duration = {
                before: true,
                hour: 5,
                minute: 30
            }
            builder.appendDuration(duration)
            expect(builder.array).toEqual(['DURATION:-PT5H30M'])
        })
    
        it('Test append attachment', () => {
            const attach: Attachment = {
                type: 'audio/basic',
                value: 'ftp://example.com/pub/'
            }
            builder.appendAttachment(attach)
            expect(builder.array).toEqual(['ATTACH;FMPTYPE=audio/basic:ftp://example.com/pub/'])
        })
    
        it('Test append multiple attachments', () => {
            const attach: Attachment[] = [
                {
                    value: 'http://example.com/public/quarterly-report.doc'
                },
                {
                    type: 'application/msword',
                    value: 'ftp://example.com/pub/docs/agenda.doc'
                }
            ]
            builder.appendAttachments(attach)
            expect(builder.array).toEqual([
                'ATTACH:http://example.com/public/quarterly-report.doc',
                'ATTACH;FMPTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc'
            ])
        })
    
        it('Test append simple attendee', () => {
            const attendee: Attendee = {
                address: 'mailto:john_public@example.com'
            }
            builder.appendAttendee(attendee)
            expect(builder.array).toEqual(['ATTENDEE:mailto:john_public@example.com'])
        })
    
        it('Test append complex attendee', () => {
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
            builder.appendAttendee(attendee)
            expect(builder.array).toEqual(['ATTENDEE;CN=Henry Cabot;CUTYPE=GROUP;MEMBER="mailto:projectA@example.com","mailto:projectB@example.com";ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=true;DELEGATED-TO="mailto:jdoe@example.com","mailto:jqpublic@example.com";DELEGATED-FROM="mailto:jsmith@example.com":mailto:john_public@example.com'])
        })
    
        it('Test append multiple simple attendees', () => {
            const attendees: Attendee[] = [
                {
                    address: 'mailto:john_public@example.com'
                },
                {
                    address: 'mailto:joecool@example.com'
                }
            ]
            builder.appendAttendees(attendees)
            expect(builder.array).toEqual([
                'ATTENDEE:mailto:john_public@example.com',
                'ATTENDEE:mailto:joecool@example.com'
            ])
        })
    
        it('Test append simple relation', () => {
            const relation: Relation = {
                value: 'jsmith.part7.19960817T083000.xyzMail@example.com'
            }
            builder.appendRelation(relation)
            expect(builder.array).toEqual(['RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com'])
        })
    
        it('Test append complex relation', () => {
            const relation: Relation = {
                type: 'SIBLING',
                value: '19960401-080045-4000F192713@example.com'
            }
            builder.appendRelation(relation)
            expect(builder.array).toEqual(['RELATED-TO;RELTYPE=SIBLING:19960401-080045-4000F192713@example.com'])
        })
    
        it('Test append multiple relations', () => {
            const relations: Relation[] = [
                {
                    type: 'SIBLING',
                    value: '19960401-080045-4000F192713@example.com'
                },
                {
                    value: 'jsmith.part7.19960817T083000.xyzMail@example.com'
                }
            ]
            builder.appendRelations(relations)
            expect(builder.array).toEqual([
                'RELATED-TO;RELTYPE=SIBLING:19960401-080045-4000F192713@example.com',
                'RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com'
            ])
        })
    
        it('Test append simple datetime trigger', () => {
            const trigger: Trigger = {
                value: '19980403T120000Z'
            }
            builder.appendTrigger(trigger)
            expect(builder.array).toEqual(['TRIGGER:19980403T140000'])
        })
    
        it('Test append simple duration trigger', () => {
            const trigger: Trigger = {
                value: {
                    week: 2,
                    day: 4
                }
            }
            builder.appendTrigger(trigger)
            expect(builder.array).toEqual(['TRIGGER:P2W4D'])
        })
    
        it('Test append complex datetime trigger', () => {
            const trigger: Trigger = {
                related: 'START',
                value: '19980403T120000Z'
            }
            builder.appendTrigger(trigger)
            expect(builder.array).toEqual(['TRIGGER;RELATED=START:19980403T140000'])
        })
    
        it('Test append complex duration trigger', () => {
            const trigger: Trigger = {
                related: 'START',
                value: {
                    week: 2,
                    day: 4
                }
            }
            builder.appendTrigger(trigger)
            expect(builder.array).toEqual(['TRIGGER;RELATED=START:P2W4D'])
        })
    
        it('Test append xProp', () => {
            const xProp: XProp = {
                name: 'IKALENDAR-PROP',
                value: 'Matej Vilk'
            }
            builder.appendXprop(xProp)
            expect(builder.array).toEqual(['X-IKALENDAR-PROP:Matej Vilk'])
        })
    
        it('Test append multiple xProps', () => {
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
            builder.appendXprops(xProps)
            expect(builder.array).toEqual([
                'X-IKALENDAR-PROP1:Matej Vilk',
                'X-IKALENDAR-PROP2:Matej Vilk'
            ])
        })
    })

    describe('Test components', () => {
        it('Test append Event', () => {
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
            
            builder.appendEvent(event)
            expect(builder.array).toStrictEqual([
                'BEGIN:VEVENT',
                'DTSTAMP:20101020T000000',
                'UID:123',
                'DTSTART:19951225T000000',
                'CLASS:PUBLIC',
                'CREATED:20130208T090000',
                'DESCRIPTION:Event\'s description',
                'GEO:240;420',
                'LAST-MODIFIED:20130208T070000',
                'LOCATION:Event\'s location',
                'ORGANIZER:mailto:mrbig@example.com',
                'PRIORITY:0',
                'SEQUENCE:1',
                'STATUS:DRAFT',
                'SUMMARY:Event\'s summary',
                'TRANSP:TRANSPARENT',
                'URL:url',
                'RECURRENCE-ID:456',
                'DURATION:PT8H45M',
                'ATTACH;FMPTYPE=application/postscript:ftp://example.com/pub/conf/bkgrnd.ps',
                'ATTENDEE:mailto:jsmith@example.com',
                'CATEGORIES:Project Report,XYZ,Weekly Meeting',
                'COMMENT:Event\'s comment',
                'CONTACT:Contact',
                'EXDATE:19951225T000000',
                'RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com',
                'RESOURCES:Nettoyeur haute pression',
                'X-IKALENDAR-PROP1:Matej Vilk',
                'BEGIN:VALARM',
                'ACTION:AUDIO',
                'TRIGGER:P20W365D',
                'END:VALARM',
                'END:VEVENT',
            ])
        })
    })

})
