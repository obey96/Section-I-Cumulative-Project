"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// show story after click event 
function navSubmitStoryClick(evt) {
console.debug('navSubmitStoryClick', evt);
hidePageComponents();
$allStoriesList.show();
$submitForm.show();
}

$navSubmitStory.on('click', navSubmitStoryClick);


// show favorite after click event

function navFavoritesClick(evt) {
console.debug('navFavoritesClick', evt);
hidePageComponents();
putFavoritesListOnPage();
}

$body.on('click', '#nav-favorites', navFavoritesClick);

function navMyStories(evt) {
console.debug('navMyStories', evt);
hidePageComponents();
putUserStoriesOnPage();
$ownStories.show();

}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide()
}

$navLogin.on("click", navLoginClick);


// Hides everything but the profile after a click event 

function navProfileClick(evt) {
console.debug('navProfileClick', evt);
hidePageComponents();
$userProfile.show();
}

$navUserProfile.on('click', navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").css('display', 'flex');
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
