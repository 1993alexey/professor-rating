import { getProfessorRating } from '../data-processing/professorData.js'

async function displayRatings() {
    const containers = getProfessorContainers()
    for (let container of containers)
        displayOneRating(container)
}

async function displayOneRating(container) {
    const rating = await getProfessorRating(container.innerText)
    if (rating) {
        const name = container.innerText
        container.innerHTML = `<a href="${rating.link}" target="_blank">${name}</a>`
        container.innerHTML += createRating(rating.rating)
        console.log(rating)
    }
}


function getProfessorContainers() {
    const containers = []
    const rows = document.getElementById('pg0_V_dgCourses').children[1].children
    for (let row of rows)
        containers.push(row.children[4])

    return containers
}

function createRating(rating) {
    return `<div class="star-ratings-css">
        <div class="star-ratings-css-top" style="width: ${convertRating(rating)}%">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
    </div>`
}

function isRegistrationPage() {
    try {
        const container = document.getElementsByClassName('pHead')[0]
        if (container.children[0].innerText == 'REGISTRATION - RESULTS')
            return true
        else
            return false
    } catch (e) {
        return false
    }
}

function convertRating(rating) {
    return 105 * (rating / 5)
}

if (isRegistrationPage())
    displayRatings()