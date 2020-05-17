import { getProfessorRating } from './professorData.js'

displayRatings()

async function displayRatings() {
    const raiting = await getProfessorRating('peter')
    console.log(raiting)
}
