chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getLinkedInProfiles") {
    const profileLinks = Array.from(
      document.querySelectorAll(
        "span.entity-result__title-text > a.app-aware-link"
      )
    );

    const likedLinkedinURLs =
      Array.from(
        document.querySelectorAll(
          "li.social-details-reactors-tab-body-list-item.artdeco-list__item.full-width a.link-without-hover-state"
        )
      ).map((link) => link.href) || [];

    const alsoViewedlinkedinURLs = Array.from(
      new Set(
        Array.from(
          document.querySelectorAll(
            'li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column a[data-field="browsemap_card_click"]'
          ),
          (linkElement) =>
            new URL(linkElement.href).origin +
            new URL(linkElement.href).pathname
        )
      )
    );

    const profiles =
      profileLinks.map(function (link) {
        const href = link.getAttribute("href");
        const index = href.indexOf("?");
        return index !== -1 ? href.slice(0, index) : href;
      }) || [];

    // Combine profile links and LinkedIn URLs into one array
    const combinedProfiles = [
      ...profiles,
      ...likedLinkedinURLs,
      ...alsoViewedlinkedinURLs,
    ];

    sendResponse({ profiles: combinedProfiles });
  }
});
