"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const deleteButton = false;

  const hostName = story.getHostName();
  const showFave = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${deleteButton ? deleteButtonHTML() : ""}
        ${showFave ? faveButtonHTML() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Delete Button */
function deleteButtonHTML() {
  return `<span class="trash-can">
            <i class="fas fa-trash-alt"></i>
          </span>`;
}

function faveButtonHTML(story, user) {
  const isFavorite = user.isFave(story);
  const iconType = isFavorite ? "fa fa-star" : "fa fa-star-o";

  return `<span class="fave-button">
            <i class=${iconType}></i>
          </span>`
};

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Grabs info from form to submit a story */
async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();

  // grab the author, url and title
  const storyAuthor = $("#new-story-author").val();
  const storyURL = $("#new-story-url").val();
  const storyTitle = $("#new-story-title").val();

  const newStory = {
    author: storyAuthor,
    url: storyURL,
    title: storyTitle
  };

  //finds user info and adds to story list as well as user memory
  const response = await StoryList.addStory(user, newStory);
}

$storyForm.on("submit", submitStory);

/** Functio to delete a story */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $li = $(evt.target).closest("li");
  const storyId = $li.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}

/** Function to show list of user's stories */
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if(currentUser.ownStories.length === 0) {
    $ownStories.append("No Stories Added");
  } else {
    for(let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

/** Function to show list of user's favorites */
function putFaveStoriesOnPage() {
  console.debug("putFaveStoriesOnPage");

  $ownStories.empty();

  if(currentUser.ownStories.length === 0) {
    $faveStories.append("No Stories Added");
  } else {
    for(let story of currentUser.favorites) {
      let $story = generateStoryMarkup(story);
      $faveStories.append($story);
    }
  }
  $faveStories.show();
}

/** Function to handle favoriting and unfavoriting click events */
async function toggleFave(evt) {
  console.debug("toggleFave");

  const $target = $(evt.target);
  const $li = $target.closest("li");
  const storyId = $li.arrt("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($target.hasClass("fa fa-star")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fa fas-star-o");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fa fas-star");
  }

  $allStoriesList.on("click", ".star", toggleFave);
}