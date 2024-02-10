import { getProfessorRating, getProfessorDetails } from '../data-processing/professorData.js'

async function displayRatings() {
    const containers = getProfessorContainers()
    const displayRef = []
    for (let container of containers)
        displayRef.push(displayOneRating(container))

    // remove extra gap
    Promise.all(displayRef).then((results) => {
        let min = 999999
        for (let result of results) {
            if (result && result.height < min)
                min = result.height
        }

        for (let result of results) {
            if (result && result.height > min)
                result.el.classList.add('gap')
        }
    })
}

async function displayOneRating(container) {
    const professor = await getProfessorRating(container.innerText)
    if (professor && professor.rating) {
        //create link
        const name = container.innerText
        const link = document.createElement('a')
        link.href = professor.link
        link.classList.add('tool')
        link.target = '_blank'
        link.innerText = name
        container.innerHTML = ''
        link.innerHTML += getLoadingView()

        // fetch data when mouse is hovered over the link
        link.addEventListener('mouseover', async (e) => {
            const el = e.target
            const loadingEl = el.getElementsByClassName('lds-ripple')
            if (el.classList.contains('tool') && el.hasAttribute('href') && loadingEl.length) {
                const tooltip = el.firstElementChild
                tooltip.innerHTML = createPopupContent(professor)
            }
        })

        container.append(link)
        container.append(createRating(professor.rating))

        return { el: link, height: link.offsetHeight }
    }
}

function createPopupContent(professor) {
    let ratingDisplay

    if (professor.numRatings)
        ratingDisplay = `${professor.rating} (based on ${professor.numRatings} rating${professor.numRatings && professor.numRatings.length > 1 ? 's' : ''})`
    else
        ratingDisplay = professor.rating

    const tags = professor.tags.map(tag => `${tag.tagName} (${tag.tagCount})`)

    return (
        `<div>
            <div><span>Name: </span>${professor.name ? professor.name : 'N/A'}</div>
            <div><span>Department: </span>${professor.department ? professor.department : 'N/A'}</div>
            <div><span>Rating: </span>${professor.rating ? ratingDisplay : 'N/A'}</div>
            <div><span>Difficulty: </span> ${professor.difficulty ? Math.round(professor.difficulty * 10) / 10 : 'N/A'}</div>
            <div><span>Take again: </span> ${professor.takeAgain != - 1 ?  Math.round(professor.takeAgain * 10) / 10 + '%': 'N/A'}</div>
            <div><span>Top tags: </span> ${tags ? tags.join(', ') : 'N/A'}</div>
            <br>
            <div><span>Most recent comment: </span> </div>
            <div>${professor.comment ? professor.comment : 'N/A'}</div>
            <br>
            <div><a href="${professor.link}" target="_blank">View on RateMyProfessors.com</a></div>
         </div>`
    )
}

function getLoadingView() {
    return ` <div class="data">
                <div class="lds-ripple"><div></div><div></div></div>
                <div class="loading-text">Loading...</div>
            </div>`
}


function getProfessorContainers() {
    const containers = []
    const rows = document.getElementById('tableCourses').children[1].children
    for (let row of rows)
        containers.push(row.children[4])

    return containers
}

function createRating(rating) {
    const div = document.createElement('div')
    div.className = 'star-container'
    div.innerHTML = `
        <div class="top-layer" style="width: ${convertRating(rating)}%">
            <div class="top-layer-container">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.002 512.002"
                    style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">
                    <path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                                        			c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                                        			c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                                        			c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                                        			l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                                        			C511.56,208.649,513.033,202.688,511.267,197.258z" />
                </svg>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.002 512.002"
                    style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">
                    <path
                        d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                                                    c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                                                    c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                                                    c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                                                    l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                                                    C511.56,208.649,513.033,202.688,511.267,197.258z" />
                </svg>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.002 512.002"
                    style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">
                    <path
                        d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                                                    c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                                                    c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                                                    c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                                                    l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                                                    C511.56,208.649,513.033,202.688,511.267,197.258z" />
                </svg>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.002 512.002"
                    style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">
                    <path
                        d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                                                    c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                                                    c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                                                    c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                                                    l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                                                    C511.56,208.649,513.033,202.688,511.267,197.258z" />
                </svg>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.002 512.002"
                    style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">
                    <path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                                                c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                                                c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                                                c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                                                l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                                                C511.56,208.649,513.033,202.688,511.267,197.258z" />
                </svg>
            </div>
        </div>
        <div class="bottom-layer">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;"
                xml:space="preserve">
                <path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                        			c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                        			c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                        			c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                        			l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                        			C511.56,208.649,513.033,202.688,511.267,197.258z" />
            </svg>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;"
                xml:space="preserve">
                <path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                    c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                    c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                    c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                    l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                    C511.56,208.649,513.033,202.688,511.267,197.258z" />
            </svg>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;"
                xml:space="preserve">
                <path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                    c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                    c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                    c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                    l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                    C511.56,208.649,513.033,202.688,511.267,197.258z" />
            </svg>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;"
                xml:space="preserve">
                <path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                    c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                    c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                    c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                    l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                    C511.56,208.649,513.033,202.688,511.267,197.258z" />
            </svg>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;"
                xml:space="preserve">
                <path d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157
                                c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065
                                c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671
                                c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638
                                l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955
                                C511.56,208.649,513.033,202.688,511.267,197.258z" />
            </svg>
        </div>
            
            `
    return div
}

function isRegistrationPage() {
    try {
        let container = document.getElementById('tableCourses') // migrated from version 0.0.6 with value pg0_V_dgCourses
        if (container)
            return true
        else
            return false
    } catch (e) {
        return false
    }
}

function convertRating(rating) {
    return 100 * (rating / 5)
}

if (isRegistrationPage())
    setTimeout(displayRatings, 1000)
