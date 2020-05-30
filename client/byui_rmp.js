import { getProfessorRating } from './professorData.js'

displayRatings()
// getTeacherName()
async function displayRatings() {
    const rating = await getProfessorRating('Blanchard, Todd')
    console.log(rating)
    console.log(getProfessorContainers())


}
// function getTeacherName() {
//     let teacherName = document.getElementsByTagName('td')[12].innerHTML
//     console.log('hi')
//     console.log(teacherName)
// }

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