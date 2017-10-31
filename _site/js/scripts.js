(function() {


/////////////////////////////
// View More Functionality //
////////////////////////////

// Variables needed for sidebar nav
var articleList = document.querySelectorAll('.article__list');
var sidebar = document.querySelector('.sidebar');

// Check if sidebar exists on page
// This will be the case for all pages except Home
if (sidebar) {

  // Get all 'View More' buttons and save to view
  var view = document.querySelectorAll('.view');
  // Add event listeners to all 'View More' buttons
  for (var i = 0; i < view.length; i++) {

    // Get specific viewButton
    var viewButton = view[i]

    // Define actions to take on click
    viewButton.addEventListener('click', function(e) {
      e.preventDefault();
      // On click, find all parent nodes with the class '.non-featured'
      // and store them in variable
      var hiddenItems = this.parentNode.parentNode.querySelectorAll('.non-featured');

      // Change the text on the 'View More button based on inner text'
      if (this.innerHTML.includes('View More') === true) {
        this.innerHTML = 'View Less';
        this.style.borderLeft = '0';
      } else {
        this.innerHTML = 'View More';
        this.style.borderLeft = '1px solid #2C3F4A';
      }

      // View more animation
      this.classList.toggle('slide');

      // Hide/Show all hiddenItems
      for (var j = 0; j < hiddenItems.length; j++) {
        hiddenItems[j].classList.toggle('hidden');
      }

    }, false);
  }
}


///////////////////////////////
// Collapsable Nav Sections //
/////////////////////////////

// Store Variables
var expander = document.querySelectorAll('.expand');

// Add event listener to all 'Expand' icons
for (var c = 0; c < expander.length; c++){
  expander[c].addEventListener('click', function(e) {
    e.preventDefault();

    // Rotate icon on click
    this.classList.toggle('rotate');

    // Get the correct list heading based on which icon was clicked
    var listSelector = this.parentNode.parentNode;

    // Get all articles under the correct list
    var expandLists = listSelector.querySelectorAll('.article__list');

    // Collapse or Expand all lists under the clicked heading
    for (var d = 0; d < expandLists.length; d++) {
      expandLists[d].classList.toggle('slide-up-hidden');
    }
  })
}


///////////////////////////////
//         Search           //
/////////////////////////////

// Get variables needed for search interaction

// Store body so can prevent scrolling when search is active
var body = document.querySelector('body');

// Search label on full-view search
var label = document.querySelector('.search--label');

// Results container from Simple Jekyll Search
var resultsContainer = document.getElementById('results-container');

// Where formatted results from resultsContainer will go
var results = document.querySelector('.full-view__search');

// Search input
var searchBox = document.querySelector('#search-input');

// X (Close Search)
var x = document.querySelector('.x');

// Nav Toggle on mobile
var nav = document.querySelector('#nav-toggle');

// Search Icon next to search bar
var searchIcon = document.querySelector('.search-icon');

// Store current search type (Home page vs Doc page)
var searchClass = searchBox.classList[0];

// Function to open to full-screen search
function keydownSearch() {

    // Check if on home page (search__minview) or
    // if on docs page (search__minview--page)
    // and then removes default styles so that full-view
    // search is the same
    if (searchClass[0] === 'search__minview') {
      searchBox.classList.remove('search__minview');
    } else {
      searchBox.classList.remove('search__minview--page');
    }

    // Adds full-screen search styles
    searchBox.classList.add('search__fullview');

    // Show fullscreen label
    label.classList.add('show');
    label.classList.remove('hide');

    // Show search results
    results.classList.add('show');
    results.classList.remove('hide');

    // Show X (Close) button
    x.classList.add('show');
    x.classList.remove('hide');

    // Remove scrolling from body
    body.classList.add('no-scroll');

    // If on page with nav, also hide the nav
    if (nav) {
      nav.classList.add('hide');
    }

    // Since this takes the results from the SJS
    // results container, it needs to wait until that
    // has been populated before moving them to the
    // formatted results container
    setTimeout(function() {
        // Format search results
        recreateList();
    }, 100);
}

// Function to close full-screen search
function closeSearch(e) {
  // If a link is clicked, go to link destination
  if (e) {
    return true
  } else {
    // Check if on home page (search__minview) or
    // if on docs page (search__minview--page)
    // and then removes default styles so that full-view
    // search is the same
    if (searchClass === 'search__minview') {
      searchBox.classList.add('search__minview');
    } else {
      searchBox.classList.add('search__minview--page');
    }

    // Removes full-screen search styles
    searchBox.classList.remove('search__fullview');

    // Remove fullscreen label
    label.classList.add('hide');
    label.classList.remove('show');

    // Close search results
    results.classList.add('hide');
    results.classList.remove('show');

    // Hide X (Close) button
    x.classList.add('hide');
    x.classList.remove('show');

    // Add scrolling to body
    body.classList.toggle('no-scroll');

    // If on page with nav, also show the nav
    if (nav) {
      nav.classList.remove('hide');
    }
  }
}

// Function to take the results from SJS
// (Which cannot be manipulated the way we needed them)
// and create a more robust list
function recreateList() {

  // This is where the results from SJS will end up after being formatted
  var destination = document.querySelector('.results--container');

  // SJS returns a bunch of list items with the class 'search-item'
  var searchItem = document.querySelectorAll('.search-item');

  // Each search result will be put here after being formatted
  var newSearchItem = '';

  // Loop through each search item
  for (var i = 0; i < searchItem.length; i++) {

    // Get the data for each search result
    var itemLink = searchItem[i].querySelector('.item-title');
    // Get the title from search result
    var title = itemLink.innerHTML;
    // Get the link from the search result
    var link = itemLink.href;

    // Add opening tag to each search result
    newSearchItem += '<li class="search--item">';
    // Turn the data into a link with the correct redirect url
    newSearchItem += '<a href="' + link + '" class="item--title">' + title;

    // Get the tag list from each search result
    var tagList = searchItem[i].querySelector('.tag--list');

    // Get the tags from the tag list
    var content = tagList.innerHTML;

    // Turn comma-delimited tag list into an array
    var contentArray = content.split(',');

    // Create list for tags to go
    var contentToAdd = '<ul class="tag--list">';

    // Check if tag list is empty
    if (contentArray[0] !== '{tags}') {
      // Loop through tag list
      for (var j = 0; j < contentArray.length; j++) {
        // Add each tag to tag list
        contentToAdd += '<li class="tag">' + contentArray[j] + '</li>';
      }
    }
    // Append tag list formatted list, close tag list
    // and close search result list item
    newSearchItem += contentToAdd + '</ul></a></li>';
   }

  // Populate formatted search results in results container
  destination.innerHTML = newSearchItem;
}

// Trigger full-screen search on search icon click
searchIcon.addEventListener('click', keydownSearch);

// Trigger full-screen search on input box focus
// searchBox.addEventListener('focus', keydownSearch);

// Trigger full-screen search on keypress
searchBox.addEventListener('keydown', keydownSearch);

// Remove full-screen search on loss of focus
searchBox.addEventListener('blur', closeSearch)


///////////////////////////////
//          Tags            //
/////////////////////////////

// Get all tags listed on docs page
var tag = document.querySelectorAll('.tag p');

// Loop through all tags listed on docs page
for (var t = 0; t < tag.length; t++) {
  // Add event listener for tag click
  tag[t].addEventListener('click', function() {
    // Get the text that will be used
    // to search from the tag
    textToSearch = this.innerHTML;

    // Put the value in the search box
    searchBox.value = textToSearch;

    // Trigger the search
    searchBox.focus();
  })
};


///////////////////////////////
//       Nav Toggle         //
/////////////////////////////

// Create custom even function
var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

// Check if the page has sidebar
if (sidebar) {

  // If page has a sidebar, add a listener for when the
  // window is resized.
  addEvent(window, "resize", function(event) {
    if (window.innerWidth < 768) {
      // Switch to collapsed sidebar on less than 768px
      sidebar.classList.add('sidebar--toggled');
    } else {
      // Otherwise show the sidebar
      sidebar.classList.remove('sidebar--toggled');
      sidebar.classList.remove('sidebar--mobile');
    }

    // If the sidebar is open, and then the screen is made
    // larger than 768px, make sure the body is able to
    // scroll. 'No-scroll' is active on full-size sidebar
    if (sidebar.classList.contains('sidebar--toggled')) {
      body.classList.remove('no-scroll');

      // Switches the nav toggle from X to hamburger
      // when the page is resized and the sidebar is open
      nav.classList.remove('active');
    }

    // When page is less than 768px, but the sidebar is
    // NOT toggled, make sure the body can scroll
    if (sidebar.classList.contains('sidebar--mobile')) {
      body.classList.remove('no-scroll');
    }
  });

  // Pretty much the same as above, but done at page load.
  if (window.innerWidth < 768) {
    sidebar.classList.add('sidebar--toggled');
  } else {
    sidebar.classList.add('sidebar');
    sidebar.classList.remove('sidebar--toggled');
  }
}

///////////////////////////////
//   Nav Toggle (Click)     //
/////////////////////////////

// Check if on home page or docs page
if (nav) {

  // Add event listener for nav toggle click
  nav.addEventListener('click', function() {
    // On click, toggle active state for icon
    this.classList.toggle('active');
    // Switch to full-screen sidebar for mobile
    if ( sidebar.classList.contains('sidebar--toggled') ) {
      sidebar.classList.remove('sidebar--toggled');
      sidebar.classList.add('sidebar--mobile');
      body.classList.add('no-scroll');
    } else {
      sidebar.classList.add('sidebar--toggled');
      body.classList.remove('no-scroll');
    }
  })
}
})()
