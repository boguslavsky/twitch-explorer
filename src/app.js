const BASE_URL = 'https://api.twitch.tv/kraken/search/streams';
const CLIENT_ID = 'rnol6rl7vokxusycd1dk7rqbddb2nw';

const streamList = document.getElementById('stream_list');
const searchForm = document.getElementById('search_form');
const searchQuery = document.getElementById('search_query');
const total = document.getElementById('total');
const prevBtn = document.getElementById('prev_btn');
const nextBtn = document.getElementById('next_btn');
const currentPage = document.getElementById('current_page');
const totalPages = document.getElementById('total_pages');

/**
  * Wrap XMLHttpRequest into Promise
*/
const get = url => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${BASE_URL}${url}`);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Client-ID', CLIENT_ID);
		xhr.send();
		xhr.onload = () => {
			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
			}
		};
		xhr.onerror = () => {
			reject(new Error('Network error'));
		};
	});
};

const formatDate = (rawDate) => {
    // TODO implement format like 3 min ago / less 1 minute ago
    return rawDate;
}

const renderStream = data => {
    // TODO best way to implement this?
    return `<li class="stream">
        <a class="stream-link" href="${data._links.self}" target="_blank">
            <img class="stream-thumb" src="${data.preview.medium}">
            <h2 class="stream-title">${data.channel.status}</h2>
            <p class="stream-text">${data.game} - ${data.viewers} viewers</p>
            <p class="stream-text">Started at: ${formatDate(data.created_at)}, Other description</p>
        </a>
    </li>`;
}

const loadStream = query => {
    // TODO loader ON
    // TODO clean streams
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    get(`?query=${query}`).then(response => { // pass other pagination params here
        total.textContent = response._total
        // TODO if next available: nextBtn.disabled = false;
        // TODO if prev available: prevBtn.disabled = false;
        let streams = ''; // TODO explain why we do this
        response.streams.forEach(stream => {
            streams += renderStream(stream)
        });
        streamList.insertAdjacentHTML('afterbegin', streams);
        // TODO loader OFF
    }).catch(error => {
        // TODO show error
        // TODO loader OFF
    });
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchQuery.value;
    if (value === '') {
        // TODO show error
    }
    loadStream(encodeURI(value));
});

prevBtn.addEventListener('click', () => {
    // load next
});

nextBtn.addEventListener('click', () => {
    // load prev
});
