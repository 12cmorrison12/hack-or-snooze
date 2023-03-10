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

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user clicks on the submit link */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $(".main-nav-links").show();
  hidePageComponents();
  $storyForm.show();
}

$storyForm.on("click", navSubmitClick);

/** When a user clicks on profile */
function showProfileClick(evt) {
  console.debug("shoProfileClick");
  $(".main-nav-links").show();
  hidePageComponents();
  $userProfile.show();
}

$userProfile.on("click", showProfileClick);

/** When a user clicks user stories link */

function showUserStoriesClick(evt) {
  console.debug("showUserStoriesClick");
  $(".main-nav-links").show();
  hidePageComponents();
  $faveStories.show();
}

$faveStories.on("click", showUserStoriesClick);
