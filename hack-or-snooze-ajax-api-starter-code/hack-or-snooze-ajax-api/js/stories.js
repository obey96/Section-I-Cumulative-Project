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
 * - story: an instance of Storypytho
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

// It creates a delete buttom for story
function getDeleteBtnHTML () {
return`
<span class='trash-can'>
<i class='fas fa-trash-alt'></i>
  </span> `;
}

// Make favorite star for story
function getStarHTML(story, user){
const isFavorite = user.isFavorite(story);
const starType = isFavorite ? 'fas' : 'far';
return `
<span class='star'>
<i class='${starType} fa-star'></i>
</span>`;
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  // location.reload();

  $allStoriesList.show();
}


// delete stories
async function deleteStory(evt) {
console.debug('deleteStory');

const $closestLi = $(evt.target).closest('li');
const storyId = $closestLi.attr('id');
await storyList.removeStory(currentUser, storyId);

// re-generate story list
await putUserStoriesOnPage();
}

$ownStories.on('click', '.trash-can', deleteStory);

// function that sends new form for a new story
async function submitNewStory(evt) {
console.debug('submitNewStory');
evt.preventDefault ();

// grabs all the info
const title = $('#create-title').val();
const url = $('#create-url').val()
const author = $('#create-author').val();
const username = currentUser.username
const storyData = { title, url, author, username};
const story = await storyList.addStory(currentUser, storyData);
const $story = generateStoryMarkup(story);
$allStoriesList.prepend($story);

// hide the form and reset it
$submitForm.slideUp('slow');
$submitForm.trigger('reset');
   }
$submitForm.on('submit', submitNewStory);

function putUserStoriesOnPage() {
console.debug('putUserStoriesOnPage');

$ownStories.empty();

if ( currentUser.ownStories.length === 0) {
  $ownStories.append('<h5> no stories added yet</h5>');
} else {
// loop through all of users stories and generate HTML for them

for(let story of currentUser.ownStories) {
  let $story = generateStoryMarkup(story,true);
  $ownStories.append($story);
}
  }
$ownStories.show();
}


// Put favorites list on page

function putFavoritesListOnPage() {
console.debug('putFavoritesListOnPage');

$favoritedStories.empty();

if(currentUser.favorites.length === 0) {
$favoritedStories.append('<h5>no favorites added</h5>');
} else {
// loop to generate html
  for (let story of currentUser.favorites){
    const $story = generateStoryMarkup(story);
    $favoritedStories.append($story);
  }
} 
$favoritedStories.show();
  }

  // toggle favorite/un-favorite story

  async function toggleStoryFavorite(evt){
console.debug('toggleStoryFavorite');

const $tgt = $(evt.target);
const $closestLi = $tgt.closest('li');
const storyId = $closestLi.attr('id');
const story = storyList.stories.find(s => s.storyId === storyId);

//  I copy this from answer because fuction was not working properly

 // see if the item is already favorited (checking by presence of star)
 if ($tgt.hasClass('fas')) {
  // currently a favorite: remove from user's fav list and change star
  await currentUser.removeFavorite(story);
  $tgt.closest('i').toggleClass('fas far');
} else {
  // currently not a favorite: do the opposite
  await currentUser.addFavorite(story);
  $tgt.closest('i').toggleClass('fas far');
}
}

$storiesLists.on('click', '.star', toggleStoryFavorite);

console.log();