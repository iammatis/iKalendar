import Builder from '../src/builder'

describe('Test Builder Class', () => {

    describe('Test events', () => {

        it('Test simple event', () => {
            const builder = new Builder({
                version: '2.0',
                prodId: 'prodID',
                events: [
                    {
                        dtStamp: '20101231T083000',
                        uid: 'uid1'
                    }
                ]
            })
            const data = builder.build()
            expect(data).toEqual('')
        })
    })
})
