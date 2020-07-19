const storageItem = 'byuiRMP'
const cacheValidFor = 2 // days
const professors = init(storageItem)

export async function getProfessorRating(searchStr) {
    searchStr = preprocessName(searchStr)

    if (searchStr in professors && validCache(professors[searchStr]))
        return professors[searchStr]

    // make sure we found the requested professor
    const res = await findProfessor(searchStr)
    if (!res || !res.response.numFound) {
        professors[searchStr] = null
        saveProfessors(professors, storageItem)
        return
    }

    // create professor from response
    const professorParams = res.response.docs[0]
    const professor = {}
    professor['link'] = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorParams.pk_id}`
    professor['rating'] = professorParams.averageratingscore_rf
    professor['difficulty'] = professorParams.averageeasyscore_rf
    professor['retrievedAt'] = new Date()
    professors[searchStr] = professor

    saveProfessors(professors, storageItem)
    return professors[searchStr]
}

export async function getProfessorDetails(searchStr) {
    searchStr = preprocessName(searchStr)
    let professor = professors[searchStr]

    if (!professor)
        return

    if (validCache(professor) && 'review' in professor)
        return professors[searchStr]

    const details = await fetchProfessorDetails(professor)
    if (details) {
        professor = { ...professor, ...details }
        professors[searchStr] = professor
        saveProfessors(professors, storageItem)
    }

    return professor
}

async function fetchProfessorDetails(professor) {
    let htmlText = (await sendMessage({ url: professor.link, target: 'details' })).data
    const html = new DOMParser().parseFromString(htmlText, "text/html");

    try {
        const tags = []
        const name = html.getElementsByClassName('NameTitle__Name-dowf0z-0').item(0).textContent
        const feedback = getFeedback(html.getElementsByClassName('TeacherFeedback__StyledTeacherFeedback-gzhlj7-0')[0])
        const takeAgain = feedback.takeAgain
        const institution = html.getElementsByClassName('NameTitle__Title-dowf0z-1').item(0)
        const department = institution.firstElementChild.firstElementChild.textContent.replace(' department', '')
        const ratingBlocks = html.getElementsByClassName('Rating__StyledRating-sc-1rhvpxz-0')
        const mostHelpful = html.getElementsByClassName('HelpfulRating__StyledRating-sc-4ngnti-0')[0]
        const numRatings = html.getElementsByClassName('RatingValue__NumRatings-qw8sqy-0 jvzMox')[0].innerText.split(' ')[1]
        let tagsHtml = html.getElementsByClassName('TeacherTags__TagsContainer-sc-16vmh1y-0 dbxJaW')
        let review = ''


        if (mostHelpful)
            review = mostHelpful.getElementsByClassName('Comments__StyledComments-dzzyvm-0').item(0).textContent
        else if (ratingBlocks[0])
            review = ratingBlocks[0].getElementsByClassName('Comments__StyledComments-dzzyvm-0').item(0).textContent

        if (tagsHtml.length)
            tagsHtml = tagsHtml[0].children

        for (let tagHtml of tagsHtml)
            tags.push(tagHtml.textContent)

        return { name, takeAgain, department, review, tags, numRatings }
    } catch (e) {
        console.error(e.message)
    }
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

async function findProfessor(searchStr) {
    const nameSplit = searchStr.split(' ')
    if (nameSplit.length == 2)
        return await fetchProfessor(searchStr)

    let res = await fetchProfessor(nameSplit[0] + ' ' + nameSplit[1])
    if (!res.response.numFound) {
        res = await fetchProfessor(nameSplit[0] + ' ' + nameSplit[2])
        if (!res.response.numFound)
            return null
    }

    return res
}


function fetchProfessor(searchStr) {
    const baseUrl = 'https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=5&wt=json'
    const url = `${baseUrl}&q=${searchStr} AND schoolid_s:1754`
    return sendMessage({ url, target: 'rating' })
}

function init(storageItem) {
    let professors = localStorage.getItem(storageItem);
    if (!professors)
        return {}

    return JSON.parse(professors)
}

async function saveProfessors(professors, storageItem) {
    const json = JSON.stringify(professors)
    localStorage.setItem(storageItem, json)
}

function sendMessage(req) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(req, res => {
            if (res && 'success' in res) {
                delete res.success
                resolve(res)
            } else {
                reject(res)
            }
        });
    });
}

function validCache(professor) {
    if (!professor)
        return true

    let expiresAt = new Date(professor.retrievedAt)
    expiresAt.setDate(expiresAt.getDate() + cacheValidFor)
    if (expiresAt > new Date())
        return true

    return false
}

function preprocessName(name) {
    const i = name.indexOf('.')
    if (i != -1 && name[i - 2] === ' ')
        name = name.slice(0, i - 2) + name.slice(i + 1);

    // TODO: handle spacial case when multiple teachers are teaching
    if (name.split(',').length > 2)
        console.log(name)

    name = name.replace(',', '').trim()

    return name
}