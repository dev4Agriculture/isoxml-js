import { JSDOM } from 'jsdom'
import { readFileSync, writeFileSync } from "fs"
import Handlebars from 'handlebars'

interface pgn {
    id: number
    name: string
}

export const pgnRootPage = "https://www.isobus.net/isobus/pGNAndSPN/?type=PGN"

export async function updatePgnData() {
    const pgns = await scrapePgnPage(pgnRootPage)
    const pgnTemplate = Handlebars.compile(readFileSync('./generation/templates/PGNs.hbs', 'utf8'))
    writeFileSync('./src/PGNs.ts', pgnTemplate({ pgn: pgns }))
}

export async function scrapePgnPage(url: string, pgns: pgn[] = []) {
    console.log(`Processing ${url}...`)
    const dom = await JSDOM.fromURL(url)
    const document = dom.window.document

    const pgnTable = document.querySelector('table')
    const pgnRows = pgnTable.querySelectorAll('tr')

    for (const row of pgnRows) {
        const cells = row.querySelectorAll('tbody td')
        if (cells.length == 0) continue
        const pgnId = cells[0].textContent.trim()
        const pgnName = cells[1].textContent.trim().replace(/\r?\n|\r/g, ' ')
        pgns.push({ id: pgnId, name: pgnName })
    }

    const nextPageAnchor = document.querySelector('li.page.selected + li.page a')
    if (nextPageAnchor == null)
        return pgns

    const nextPageUrl = new URL(nextPageAnchor.attributes['href'].value, url)
    return scrapePgnPage(nextPageUrl.toString(), pgns)
}
