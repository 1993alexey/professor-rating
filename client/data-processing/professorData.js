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

export function getProfessorDetails(searchStr) {

}

async function findProfessor(searchStr) {
    const nameSplit = searchStr.split(' ')
    if (nameSplit.length == 2)
        return await fetchProfessor(searchStr)

    console.log(nameSplit[0] + ' ' + nameSplit[1])
    let res = await fetchProfessor(nameSplit[0] + ' ' + nameSplit[1])
    if (!res.response.numFound) {
        res = await fetchProfessor(nameSplit[0] + ' ' + nameSplit[2])
        console.log(nameSplit[0] + ' ' + nameSplit[2])
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

    name = name.replace(',', '')

    return name
}