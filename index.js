/* eslint-env webextensions */
let linkElements
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'HREFS_REQUEST':
      linkElements = Array.from(document.querySelectorAll('[href]'))
      const hrefs = linkElements
        .map(link => link.href)
        .filter(link => link)
        .filter(link => !link.startsWith('javascript:'))
      sendResponse({ hrefs })
      break
    case 'HIGHLIGHT_HREFS':
      linkElements.forEach(element => {
        if (message.hrefs.includes(element.href)) {
          element.style.border = 'thin solid blue'
        } else {
          // TODO: save and restore original value
          element.style.border = 'unset'
        }
      })
      break
    case 'CLEAN_HIGHLIGHTS':
      linkElements.forEach(element => {
        // TODO: save and restore original value
        element.style.border = 'unset'
      })
      break
  }
})
