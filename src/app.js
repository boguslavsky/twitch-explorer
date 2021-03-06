// App constants
const HIDDEN_CLASS = 'hidden';
const TWITCH_API_URL = 'https://api.twitch.tv/kraken/search/streams';
const CLIENT_ID = 'rnol6rl7vokxusycd1dk7rqbddb2nw';
const LIMIT = 10;

// App controls
const loader = document.getElementById('loader');
const welcomeElement = document.getElementById('welcome_msg');
const notFoundElement = document.getElementById('not_found_msg');
const errorElement = document.getElementById('error_msg');
const streamListElement = document.getElementById('stream_list');
const searchFormElement = document.getElementById('search_form');
const searchQueryInput = document.getElementById('search_query');
const totalElement = document.getElementById('total');
const prevButton = document.getElementById('prev_btn');
const nextButton = document.getElementById('next_btn');
const currentPageElement = document.getElementById('current_page');
const totalPagesElement = document.getElementById('total_pages');

// Current search query and offset
let query = '';
let offset = '';

/**
 * Load strams from Twitch API
 * API documentation: https://dev.twitch.tv/docs/v5/reference/search/#search-streams
 */
const getStreams = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${TWITCH_API_URL}${getQueryString()}&limit=${LIMIT}`;
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Client-ID', CLIENT_ID);
        xhr.send();
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                // Check if there is an error message in the server response
                if (xhr.response.error) {
                    reject(new Error(`Error ${xhr.status}: ${xhr.response.error}`));
                    return;
                }

                // Otherwise, throw error status information
                reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network error'));
        };
    });
};

/**
 * Get human readable time from now
 */
const fromNow = rawDate => {
    const interval = Math.floor(((new Date()).getTime() - (new Date(rawDate)).getTime()) / 1000);
    const minutes = Math.floor(interval / 60) % 60;
    const hours = Math.floor(interval / 60 / 60) % 24;
    const days = Math.floor(interval / 60 / 60 / 24);

    let result = '';
    if (days > 0) {
        result += `${days}d `;
    }

    if (hours > 0) {
        result += `${hours}h `;
    }

    if (minutes > 0) {
        result += `${minutes}m `;
    }

    if (result === '') {
        result = 'less than a minute';
    }

    return result;
}

/**
 * Add thousands separators into number. Resulting format is 4,294,967,295
 */
const formatNumber = rawNumber => {
    const number = [];
    rawNumber.toString().split('').reverse().forEach((value, index) => {
        if (index > 0 && index % 3 === 0) {
            number.push(',');
        }
        number.push(value);
    });
    return number.reverse().join('');
}

/**
 * Hide DOM element using class name
 */
const hide = element => {
    if (!element.classList.contains(HIDDEN_CLASS)) {
        element.classList.add(HIDDEN_CLASS);
    }
}

/**
 * Show DOM element using class name
 */
const show = element => {
    if (element.classList.contains(HIDDEN_CLASS)) {
        element.classList.remove(HIDDEN_CLASS);
    }
}

const showError = message => {
    errorElement.textContent = message;
    show(errorElement);
}

/**
 * Stream template
 */
const renderStream = data => {
    return `<li class="stream">
        <a class="stream-link" href="${data.channel.url}" target="_blank">
            <img class="stream-thumb" src="${data.preview.medium}">
            <h2 class="stream-title">${data.channel.status}</h2>
            <p class="stream-text">${data.game} - ${formatNumber(data.viewers)} viewers</p>
            <p class="stream-text">${data.channel.name} • started ${fromNow(data.created_at)} ago • ${formatNumber(data.channel.views)} total views</p>
        </a>
    </li>`;
}

/**
 * Build search query string
 */
const getQueryString = () => {
    let str = `?query=${query}`;
    if (offset) {
        str += `&offset=${offset}`;
    }
    return str;
}

/**
 * Load streams using query parameter
 */
const loadStream = () => {
    show(loader);

    // Hide all messages
    hide(welcomeElement);
    hide(notFoundElement);
    hide(errorElement);

    // Remove all streams in a safe way
    let child = streamListElement.lastElementChild;
    while (child) {
        streamListElement.removeChild(child);
        child = streamListElement.lastElementChild;
    }

    // Disable pagination
    nextButton.disabled = true;
    prevButton.disabled = true;

    getStreams().then(response => {
        totalElement.textContent = response._total;

        // Catch empty response
        if (response._total === 0) {
            currentPageElement.textContent = '−';
            totalPagesElement.textContent = '−';
            show(notFoundElement);
            hide(loader);
            return;
        }

        currentPageElement.textContent = Math.floor(offset / LIMIT) + 1;
        totalPagesElement.textContent = Math.ceil(response._total / LIMIT);
        
        // Check "Next" button availability
        if (offset + LIMIT < response._total) {
            nextButton.disabled = false;
            nextButton.value = offset + LIMIT;
        }

        // Check "Prev" button availability
        if (offset - LIMIT >= 0) {
            prevButton.disabled = false;
            prevButton.value = offset - LIMIT;
        }

        // Combine all streams as plain HTML and then append them into streams container
        let streams = '';
        response.streams.forEach(stream => {
            streams += renderStream(stream);
        });
        streamListElement.insertAdjacentHTML('afterbegin', streams);

        hide(loader);
    }).catch(error => {
        showError(error.message);
        hide(loader);
    });
}

/**
 * Handle search form submitting
 */
searchFormElement.addEventListener('submit', event => {
    event.preventDefault();

    const value = searchQueryInput.value.trim();
    if (value === '') {
        showError('The search query cannot be empty.');
        return;
    }

    try {
        query = encodeURI(value);
    } catch (e) {
        showError('An error occurred while processing a search query. Incorrect characters were used.');
        return;
    }

    offset = 0;
    const queryString = getQueryString();
    history.pushState({query, offset}, null, queryString);
    loadStream();
});

/**
 * Handle click on "Prev" button
 */
prevButton.addEventListener('click', () => {
    offset = parseInt(prevButton.value);
    history.pushState({query, offset}, null, getQueryString());
    loadStream();
});

/**
 * Handle click on "Next" button
 */
nextButton.addEventListener('click', () => {
    offset = parseInt(nextButton.value);
    history.pushState({query, offset}, null, getQueryString());
    loadStream();
});

/**
 * Handle history entry changes
 */
window.addEventListener('popstate', event => {
    if (!event.state || typeof event.state.query === 'undefined') {
        return;
    }

    searchQueryInput.value = decodeURI(event.state.query);
    query = event.state.query;
    offset = event.state.offset;
    loadStream();
});

/**
 * Initialize application
 */
(() => {
    // Parse URL params and check if there are params for this app
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query');
    const offsetParam = urlParams.get('offset');

    if (!queryParam) {
        return;
    }

    searchQueryInput.value = decodeURI(queryParam);
    query = queryParam;
    offset = offsetParam ? parseInt(offsetParam) : 0;
    loadStream();
})();
