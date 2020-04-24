import axios from 'axios'
import { JSDOM } from 'jsdom'

const baseUrl = 'https://www.ratemyprofessors.com/'
const searchParams = {
    query: '',
    state: 'ID',
    school: 'brigham young university - idaho'
}

function buildSearchUrl(query = '', state = '', school = '', page = 0, country = 'united states') {
    let url = `${baseUrl}search.jsp?queryBy=teacherName&country=${country}`
    url += `&stateselect=${state}&queryoption=HEADER&query=${query}&facetSearch=true&schoolName=${school}`
    url += `&offset=${(page - 1) * 20}&max=20`
    return url
}

async function fetchPage(pageNum = 1, params) {
    let url = buildSearchUrl(params.query, params.state, params.school, pageNum)
    const options = { resources: 'usable' };
    return JSDOM.fromURL(url, options).then(page => {
        return page.window.document
    });
}

async function getNumPages(params) {
    const document = await fetchPage(1, params)
    const steps = document.getElementsByClassName('step')
    let numPages = 1
    if (steps.length)
        numPages = steps.item(steps.length - 1).innerHTML

    return numPages
}

export default async function run() {
    const numPages = await getNumPages(searchParams)
    document = await fetchPage(1, params)
}