chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scan") {
    let text = '';
    const termsElements = document.querySelectorAll('a[href*="terms"], a[href*="privacy"]');
    if (termsElements.length > 0) {
      termsElements.forEach(el => text += el.innerText + '\n');
    } else {
      text = document.body.innerText;
    }
    if (/terms of service|privacy policy/i.test(text)) {
      sendResponse({text: text});
    } else {
      sendResponse({text: ''});
    }
  }
  return true;
});