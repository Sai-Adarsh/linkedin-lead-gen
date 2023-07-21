chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getLinkedInProfiles") {
    const profileLinks = Array.from(
      document.querySelectorAll(
        "span.entity-result__title-text > a.app-aware-link"
      )
    );

    const linkedinURLs =
      Array.from(
        document.querySelectorAll(
          "li.social-details-reactors-tab-body-list-item.artdeco-list__item.full-width a.link-without-hover-state"
        )
      ).map((link) => link.href) || [];

    const profiles =
      profileLinks.map(function (link) {
        const href = link.getAttribute("href");
        const index = href.indexOf("?");
        return index !== -1 ? href.slice(0, index) : href;
      }) || [];

    // Combine profile links and LinkedIn URLs into one array
    const combinedProfiles = [...profiles, ...linkedinURLs];

    sendResponse({ profiles: combinedProfiles });
  }
});
