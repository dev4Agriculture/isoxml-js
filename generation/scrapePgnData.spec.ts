import { updatePgnData, scrapePgnPage, pgnRootPage } from "./scrapePgnData"

describe('PGN Data Scraper', () => {

    it('should return data', async () => {
        const pgns = await scrapePgnPage(pgnRootPage)
        expect(pgns).toBeTruthy()
        expect(Object.keys(pgns).length).toBeGreaterThan(0)
    })

    it('should save the PGN data to its file', async () => {
        await updatePgnData()
        expect(() => require('../src/PGNs.ts')).not.toThrow()
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pgns = require('../src/PGNs.ts')
        // make sure we parsed at least 2 pages
        expect(pgns.length).toBeGreaterThan(200)
    })
})
