/* eslint-env webextensions, browser */
let hrefs
let tabId
let filtered
const input = document.getElementById('input')
const button = document.getElementById('button')
const ul = document.getElementById('list')

ul.style.listStyle = 'none'
ul.style.padding = 0
ul.style.margin = 0
ul.style.marginTop = '1em'
button.style.paddingRight = 0
button.style.marginRight = 0
button.style.width = '9em'
button.style.height = '1.8em'
input.style.margin = 0
input.style.padding = 0
input.style.marginRight = '3em'
input.style.width = '23em'
input.style.height = '1.4em'


function sendFiltered () {
  chrome.tabs.sendMessage(tabId, { type: 'HIGHLIGHT_HREFS', hrefs: filtered })
}

function sendClean () {
  chrome.tabs.sendMessage(tabId, { type: 'CLEAN_HIGHLIGHTS' })
}

function renderList () {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  button.textContent = `Open ${filtered.length} tab`
  if (filtered.length !== 1) {
    button.textContent += 's'
  }
  filtered.forEach(href => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.target = '_blank'
    a.href = href
    if (href.length < 60) {
      a.appendChild(document.createTextNode(href))
    } else {
      a.title = href
      a.appendChild(document.createTextNode(href.slice(0, 60) + '[…]'))
    }
    li.appendChild(a)
    ul.appendChild(li)
  })
}

button.addEventListener('click', function () {
  if (filtered.length > 50 && !confirm('This will open more than 50 tabs, ok?')) {
    return
  }
  filtered.forEach(url => {
    chrome.tabs.create({ url, active: false })
  })
})

input.addEventListener('input', function (event) {
  const value = event.target.value.toUpperCase()
  filtered = hrefs.filter(href => href.toUpperCase().match(value))
  renderList()
  if (event.target.value) {
    sendFiltered()
  } else {
    sendClean()
  }
})

document.addEventListener('DOMContentLoaded', function () {
  input.focus()
  chrome.tabs.query({currentWindow: true, active: true}, activeTab => {
    tabId = activeTab[0].id
    chrome.tabs.sendMessage(tabId, { type: 'HREFS_REQUEST' }, {}, response => {
      if (response && response.hrefs) {
        hrefs = response.hrefs
        filtered = hrefs
        renderList()
      }
    })
  })
})
