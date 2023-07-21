document.addEventListener("DOMContentLoaded", function () {
  const profilesTable = document.getElementById("profilesTable");
  const profilesTBody = profilesTable.querySelector("tbody");
  const clearListButton = document.getElementById("clearListButton");
  const updateButton = document.getElementById("updateButton");
  const exportCSVButton = document.getElementById("exportCSVButton");
  const totalProfilesElement = document.getElementById("totalProfiles");

  // Function to display the profiles from localStorage
  function displayProfilesFromStorage() {
    profilesTBody.innerHTML = "";
    const profiles = JSON.parse(localStorage.getItem("linkedinProfiles")) || [];
    profiles.forEach(function (profileURL) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      const link = document.createElement("a");
      link.href = profileURL;
      link.target = "_blank";
      link.textContent = profileURL;
      cell.appendChild(link);
      row.appendChild(cell);
      profilesTBody.appendChild(row);
    });
    updateTotalProfiles(profiles.length);
  }

  // Function to save profiles to localStorage
  function saveProfilesToStorage(profiles) {
    localStorage.setItem("linkedinProfiles", JSON.stringify(profiles));
  }

  // Function to clear the list
  function clearList() {
    localStorage.removeItem("linkedinProfiles");
    displayProfilesFromStorage();
  }

  // Function to update and append new profiles if not present
  function updateList() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getLinkedInProfiles" },
        function (response) {
          const existingProfiles =
            JSON.parse(localStorage.getItem("linkedinProfiles")) || [];
          const newProfiles = response.profiles.filter(function (profileURL) {
            return !existingProfiles.includes(profileURL);
          });
          const updatedProfiles = existingProfiles.concat(newProfiles);
          saveProfilesToStorage(updatedProfiles);
          displayProfilesFromStorage();
        }
      );
    });
  }

  // Function to update the total number of profiles
  function updateTotalProfiles(count) {
    totalProfilesElement.textContent = count.toString();
  }

  // Function to export profiles to CSV
  function exportToCSV() {
    const profiles = JSON.parse(localStorage.getItem("linkedinProfiles")) || [];
    const csvContent = "data:text/csv;charset=utf-8," + profiles.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "linkedin_profiles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Event listener for clear list button
  clearListButton.addEventListener("click", clearList);

  // Event listener for update button
  updateButton.addEventListener("click", updateList);

  // Event listener for export to CSV button
  exportCSVButton.addEventListener("click", exportToCSV);

  // Automatic scraping and adding profiles if URL matches
  if (window.location.href.includes("linkedin.com/search/results/people/")) {
    scrapeProfiles();
  }
  // Initial display of profiles from localStorage
  displayProfilesFromStorage();
});
