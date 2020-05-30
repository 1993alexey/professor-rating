import { getProfessorRating } from './professorData.js'

// displayRatings()
getTeacherName()
// async function displayRatings() {
//     const rating = await getProfessorRating('Blanchard, Todd')
//     console.log(rating)

//     document.getElementsByTagName('td')[12].innerHTML +=
//         `<div class="star-ratings-css">
//         <div class="star-ratings-css-top" style="width: ${convertRating(rating.rating)}%">
//             <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
//         <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
//         </div>
//     </div>`
// }
function getTeacherName() {
    let teacherName = document.getElementsByTagName('td')[12].innerHTML
    console.log('hi')
    console.log(teacherName)
}

function createRating(rating) {

    return `<div class="star-ratings-css">
        <div class="star-ratings-css-top" style="width: ${convertRating(rating)}%">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
    </div>`
}

function convertRating(rating) {
    return 105 * (rating / 5)
}