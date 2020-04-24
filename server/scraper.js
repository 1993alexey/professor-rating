import axios from 'axios'
import { JSDOM } from 'jsdom'
import { createProfessors } from './services/professorService'

const baseUrl = 'https://www.ratemyprofessors.com/'
const searchParams = {
    query: 'Neff',
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

function getProfessorUrls(document) {
    const urls = []
    const listings = document.getElementsByClassName('listing')
    for (let listing of listings)
        urls.push(listing.firstElementChild.href)

    return urls
}

function getCourseMeta(metaBlock) {
    const metaTransform = {
        'For Credit': 'forCredit',
        'Attendance': 'attendance',
        'Would Take Again': 'takeAgain',
        'Grade': 'grade',
        'Textbook': 'textbook'
    }

    const courseMeta = {}
    for (let meta of metaBlock.children) {
        const text = meta.textContent.split(': ')
        const key = text[0]
        const value = text[1]
        const metaTransformed = metaTransform[key]
        if (metaTransformed == 'grade')
            courseMeta[metaTransformed] = value
        else
            courseMeta[metaTransformed] = true
    }

    return courseMeta
}

function getRating(block) {
    const tags = []
    const quality = block.getElementsByClassName('RatingValues__RatingValue-sc-6dc747-3').item(0).textContent
    const difficulty = block.getElementsByClassName('RatingValues__RatingValue-sc-6dc747-3').item(1).textContent
    const classCode = block.getElementsByClassName('RatingHeader__StyledClass-sc-1dlkqw1-2').item(0).textContent
    const courseMeta = getCourseMeta(block.getElementsByClassName('CourseMeta__StyledCourseMeta-x344ms-0').item(0))
    const createdAt = block.getElementsByClassName('TimeStamp__StyledTimeStamp-sc-9q2r30-0').item(0).textContent
    const tagsHtml = block.getElementsByClassName('Tag-bs9vf4-0')
    const message = block.getElementsByClassName('Comments__StyledComments-dzzyvm-0').item(0).textContent

    for (let tagHtml of tagsHtml)
        tags.push(tagHtml.textContent)

    return { quality, difficulty, class: classCode, message, tags, courseMeta, createdAt }
}

async function getProfessor(url) {
    const document = (await JSDOM.fromURL(url, { resources: 'usable' })).window.document
    const ratings = []
    const name = document.getElementsByClassName('NameTitle__Name-dowf0z-0').item(0).textContent
    const firstName = name.split(' ')[0]
    const lastName = name.split(' ')[1]
    const quality = document.getElementsByClassName('RatingValue__Numerator-qw8sqy-2').item(0).textContent
    const takeAgain = document.getElementsByClassName('FeedbackItem__FeedbackNumber-uof32n-1').item(0).textContent
    const difficulty = document.getElementsByClassName('FeedbackItem__FeedbackNumber-uof32n-1').item(1).textContent
    const institution = document.getElementsByClassName('NameTitle__Title-dowf0z-1').item(0)
    const department = institution.firstElementChild.firstElementChild.textContent.replace(' department', '')
    const university = institution.children[1].textContent
    const ratingBlocks = document.getElementsByClassName('Rating__StyledRating-sc-1rhvpxz-0')

    for (let block of ratingBlocks)
        ratings.push(getRating(block))

    return { url, firstName, lastName, quality, difficulty, department, university, ratings }
}

export default async function run() {
    // const numPages = await getNumPages(searchParams)
    const urls = []
    const professors = []

    // for (let i = 1; i <= numPages; i++) {
    //     const document = await fetchPage(i, searchParams)
    //     urls.push(getProfessorUrls(document))
    // }
    urls.push('https://www.ratemyprofessors.com/ShowRatings.jsp?tid=926025')

    for (let url of urls.flat()) {
        const professor = await getProfessor(url)
        professors.push(professor)
    }

    createProfessors(professors)
}