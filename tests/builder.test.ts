import { readFileSync } from 'fs'
import { join } from 'path'

import Builder from '../src/builder'

const loadFile = (name: string) => readFileSync(join(__dirname, `./fixtures/${name}`), 'utf-8')

describe('Test Builder Class', () => {

    describe('Test events', () => {

        it('Test simple event', () => {

            const file = loadFile('events/simple_event.ics')

            const builder = new Builder({
                version: '2.0',
                prodId: '-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN',
                events: [
                    {
                        dtStamp: '20101231T083000Z',
                        uid: 'uid1@example.com'
                    }
                ]
            })
            const data = builder.build()
            expect(data).toEqual(file)
        })

        it('Test multiple attendees', () => {

            const file = loadFile('events/multiple_attendees.ics')

            const builder = new Builder({
                version: '2.0',
                prodId: '-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN',
                events: [
                    {
                        dtStamp: '20101231T083000Z',
                        uid: 'uid1@example.com',
                        attendees: [
                            {
                                cn: 'Henry Cabot',
                                address: 'mailto:hcabot@example.com',
                                role: 'REQ-PARTICIPANT'
                            },
                            {
                                address: 'mailto:ildoit@example.com',
                                role: 'REQ-PARTICIPANT',
                                delegatedFrom: ['"mailto:bob@example.com"'],
                                partstat: 'ACCEPTED',
                                cn: 'Jane Doe:mailto:jdoe@example.com'
                            }
                        ]
                    }
                ]
            })
            const data = builder.build()
            expect(data).toEqual(file)
        })

        it('Test multiple events', () => {

            const file = loadFile('events/multiple_events.ics')

            const builder = new Builder({
                version: '2.0',
                prodId: '-//Example Corp.//CalDAV Client//EN',
                events: [
                    {
                        dtStamp: '20041210T183904Z',
                        uid: '1@example.com',
                        start: '20041207T120000Z',
                        end: '20041207T130000Z',
                        summary: 'One-off Meeting'
                    },
                    {
                        dtStamp: '20041210T183838Z',
                        uid: '2@example.com',
                        start: '20041206T120000Z',
                        end: '20041206T130000Z',
                        rrule: 'FREQ=WEEKLY',
                        summary: 'Weekly Meeting'
                    },
                    {
                        dtStamp: '20041210T183838Z',
                        uid: '2@example.com',
                        start: '20041213T130000Z',
                        end: '20041213T140000Z',
                        summary: 'Weekly Meeting',
                        recurrenceId: '20041213T120000Z'
                    }
                ]
            })
            const data = builder.build()
            expect(data).toEqual(file)
        })
    })
})
