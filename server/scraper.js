import axios from 'axios'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import { createProfessors } from './services/professorService'
import { createUpdateAdministrative, getAdministrative } from './services/administrativeService'

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

function getFeedback(feedbackBlock) {
    const feedbackTransform = {
        'Would take again': 'takeAgain',
        'Level of Difficulty': 'difficulty',
    }

    let difficulty
    let takeAgain

    for (let feedback of feedbackBlock.children) {
        const feedbackTransformed = feedbackTransform[feedback.children[1].textContent]
        if (feedbackTransformed == 'difficulty')
            difficulty = feedback.children[0].textContent
        else if (feedbackTransformed == 'takeAgain')
            takeAgain = feedback.children[0].textContent
    }

    return { difficulty, takeAgain }
}

async function getProfessor(url) {
    try {
        const document = (await JSDOM.fromURL(url, { resources: 'usable' })).window.document
        const ratings = []
        const name = document.getElementsByClassName('NameTitle__Name-dowf0z-0').item(0).textContent
        const firstName = name.split(' ')[0]
        const lastName = name.split(' ')[1]
        let quality = document.getElementsByClassName('RatingValue__Numerator-qw8sqy-2').item(0).textContent
        const feedback = getFeedback(document.getElementsByClassName('TeacherFeedback__StyledTeacherFeedback-gzhlj7-0')[0])
        const takeAgain = feedback.takeAgain
        const difficulty = feedback.difficulty
        const institution = document.getElementsByClassName('NameTitle__Title-dowf0z-1').item(0)
        const department = institution.firstElementChild.firstElementChild.textContent.replace(' department', '')
        const university = institution.children[1].textContent
        const ratingBlocks = document.getElementsByClassName('Rating__StyledRating-sc-1rhvpxz-0')

        for (let block of ratingBlocks)
            ratings.push(getRating(block))

        if (quality == 'N/A')
            quality = null

        return { url, firstName, lastName, quality, difficulty, takeAgain, department, university, ratings }
    } catch (e) {
        console.error('Unable to parse information: ', url)
        console.error(e.message)
    }
}

function getDayDiff(date1, date2) {
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

export default async function run() {
    let numPages
    let urls = []
    const professors = []
    const administrative = await getAdministrative()
    const dayDiff = getDayDiff(administrative.dateFetched, new Date())

    if (dayDiff > 20) {
        console.log('Started Scraping ...')

        numPages = await getNumPages(searchParams)
        for (let i = 1; i <= numPages; i++) {
            const document = await fetchPage(i, searchParams)
            urls.push(getProfessorUrls(document))
        }

        urls = urls.flat()
        createUpdateAdministrative({ urls, dateFetched: new Date })

        let i = 0
        for (let url of urls) {
            if (i % 10 == 0)
                console.info(`Parsing page: ${i}`)

            const professor = await getProfessor(url)
            professors.push(professor)
            i++
        }

        // Save to file in case saving to db fails
        try {
            fs.writeFile('rmpdata.txt', JSON.stringify(professors), () => console.log)
        } catch (e) {
            console.error('Failed to save to file')
            console.error(e)
        }

        // save to db
        try {
            await createProfessors(professors)
        } catch (e) {
            console.error('Failed to save to db')
            console.error(e)
        }

        console.log('Scraping is finished')
    }
}