chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getLinkedInProfiles") {
    const profileLinks = Array.from(
      document.querySelectorAll(
        "span.entity-result__title-text > a.app-aware-link"
      )
    );
    const profiles = profileLinks.map(function (link) {
      const href = link.getAttribute("href");
      const index = href.indexOf("?");
      return index !== -1 ? href.slice(0, index) : href;
    });
    sendResponse({ profiles: profiles });
  }
});
