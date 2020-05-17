// imports

displayRatings()

async function displayRatings() {

    document.getElementsByTagName('td')[12].innerHTML +=
        `<div class="star-ratings-css">
        <div class="star-ratings-css-top" style="width: 50%">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
    </div>`

    document.getElementsByTagName('tbody')[0].innerHTML += `<input type="text" id="quality">`

    document.getElementById('quality').addEventListener('change', (e) => {
        const val = e.target.value
        const starEl = document.getElementsByClassName('star-ratings-css-top')[0]
        starEl.style.width = 105 * (val / 5) + '%'
    })
}
