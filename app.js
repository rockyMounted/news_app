// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = '190a2b5c44014618bca7e2bab9f48544'
  const apiUrl = 'https://news-api-v2.herokuapp.com'

  return {
    topHeadlines(country = 'ru', category = 'business', cb) { 
      http.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, cb)
    },
    everithing(query, cb) { 
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb)
    }
  }
})()

//  init selects
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews()
});

// Elements

const form = document.forms['newsControls']
const countrySelect = form.elements['country']
const categorySelect = form.elements['category']
const searchInput = form.elements['search']

form.addEventListener('submit', (e) => {
  e.preventDefault()
  loadNews()
})

// load news function

function loadNews() {
  showLoader()

  const country = countrySelect.value
  const category = categorySelect.value
  const searchText = searchInput.value

  if (!searchText) {
    newsService.topHeadlines(country, category, onGetResponse)
  } else {
    newsService.everithing(searchText, onGetResponse)
  }
}

// function on get response from server

function onGetResponse(err, res) {
  removePreloader()
  if (err) {
    showAlert(err, 'error-msg')
    return
  }

  if (!res.articles.length) {
    // show empty message HW
  }
  renderNews(res.articles)
}

// function render news

function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row')
  if (newsContainer.children.length) {
    clearContainer(newsContainer)
  }
  let fragment = ''

  news.forEach(newsItem => {
    const el = newsTemplate(newsItem)
    fragment +=el
  })
  newsContainer.insertAdjacentHTML('afterbegin', fragment)
}

// function clear container

function clearContainer(container) {
  //container.innerHTML = ''
  let child = container.lastElementChild
  while (child) {
    container.removeChild(child)
    child = container.lastElementChild
  }
}

// news item template function 

function newsTemplate({ urlToImage, title, url, descripton }) {
  if (!urlToImage) {
    urlToImage = 'https://st.depositphotos.com/2288675/2455/i/950/depositphotos_24559657-stock-photo-newspaper-headlines.jpg'
  }
  return `
  <div class = "col s12">
    <div class = "card">
      <div class = "card-image">
        <img src="${urlToImage}">
        <span class="card-title">${title || ''}</span>
      </div>
      <div class = "card-content">
        <p>${descripton || ''}</p>
      </div>
      <div class = "card-action">
        <a href="${url}">Read more</a>
      </div>
    </div>
  </div>
  `
}

function showAlert(msg, type = 'success') {
  M.toast({html: msg, classes: type,})
}

// show loader function 

function showLoader() {
  document.body.insertAdjacentHTML('afterbegin',
    `
    <div class="progress">
      <div class="indeterminate" style="width: 70%"></div>
    </div
    `)
}

// remove loader function

function removePreloader() {
  const loader = document.querySelector('.progress')
  if (loader) {
    loader.remove()
  }
}

// create button "go up"

(function() {
  'use strict';

  function trackScroll() {
    let scrolled = window.pageYOffset;
    let coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      goTopBtn.classList.add('back_to_top-show');
    }
    if (scrolled < coords) {
      goTopBtn.classList.remove('back_to_top-show');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -40);
      setTimeout(backToTop, 0);
    }
  }

  let goTopBtn = document.querySelector('.back_to_top');

  window.addEventListener('scroll', trackScroll);
  goTopBtn.addEventListener('click', backToTop);
})();