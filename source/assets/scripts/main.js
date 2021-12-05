/* eslint-disable guard-for-in */
if (typeof module !== 'undefined') {
  module.exports = {formatTime};
}

let recipeData;


if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', init);
}

/**
 * Initialization to fetch the recipes and create recipe cards.
 */
async function init() {
  try {
    recipeData = await getAllRecipes();
  } catch (e) {
    throw (e);
  }

  const searchBar = document.getElementById('search-bar');

  searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchRecipes(searchBar.value);
      // console.log(searchBar.value);
    }
  });

  // searchButton.addEventListener('click', ()=>{
  //   searchRecipes(searchBar.value);
  // });

  console.log(Object.keys(recipeData).length);
  populateHomePage(recipeData);
}

// TODO: SPLIT BASED ON HOME-PAGE CATEGORIES
// (CLARIFY CATEGORIES (e.g. trending recipes, etc.))
/**
 * Creating recipe cards from the recipeData.
 * @param {*} data the recipe data
 */
async function populateHomePage(data) {
  createRecipeCard(data, 'All Recipes');
}

/**
 * Creating recipe cards from the recipe data and section name.
 * @param {*} data data for the recipe
 * @param {*} sectionName section the card should go into
 */
async function createRecipeCard(data, sectionName) {
  // Add recipes to home page
  // 1) Create new section
  // <section id="example-recipe">
  //   <h2>Example:</h2>
  //   <div class="recipe-row">
  //     <!-- RECIPE CARD GOES HERE -->
  //   </div>
  // </section>
  // 2) Put recipes in the newly created section
  const section = document.createElement('section');
  section.setAttribute('id', 'searched-recipe');
  const sectionTitleH2 = document.createElement('h2');
  sectionTitleH2.innerHTML = `${sectionName}:`;
  const sectionRecipeDiv = document.createElement('div');
  sectionRecipeDiv.classList.add('recipe-row');
  section.appendChild(sectionTitleH2);
  section.appendChild(sectionRecipeDiv);

  for (const recipe of data) {
    console.log(recipe);
    // Card DOM Structure
    /* *********************************** *
         * card format:
         * <div class='card'>
         *      <div class='card-body'>
         *      <img src='{recipe's thumbnail}'>
         *          <h4> {recipe's name} </h4>
         *          <p> Cook/prep time </p>
         *          <p> User's name (who created the recipe) </p>
         *          <div class='tags'>
         *              <button> {recipe's tag 1} </button>
         *              ... // more tags go here
         *          </div>
         *      </div>
         *      <div class='card-footer'>
         *          <button>View Recipe</button>
         *      </div>
         * </div>
         *
         * *********************************** */
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.classList.add('col-md-3');
    cardDiv.classList.add('col-sm-6');
    // cardDiv.setAttribute('style', "width: 18rem;")
    const thumbnailImg = document.createElement('img');
    thumbnailImg.setAttribute('src', recipe.data.imageURL);

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    const recipeTitleH4 = document.createElement('h4');
    recipeTitleH4.innerHTML = recipe.data.name;
    recipeTitleH4.classList.add('recipe-title-capitalize');

    const timeP = document.createElement('p');
    timeP.innerHTML = formatTime(recipe.data.cookTime);

    const recipeOwnerP = document.createElement('p');
    recipeOwnerP.innerHTML = 'By ' + recipe.data.author.italics();

    console.log('ingredients ', recipe.data.recipeIngredient);

    // use loop to check for all tags
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tags-div');
    for (const tag in recipe.data.tags) {
      const tagButton = document.createElement('button');
      tagButton.innerHTML = recipe.data.tags[tag];
      tagButton.classList.add('tag');
      tagDiv.appendChild(tagButton);
      searchByTag(tagButton, tagButton.innerHTML);
    }

    const cardFooterDiv = document.createElement('div');
    cardFooterDiv.classList.add('card-footer');

    // SPA Button -- TODO: display recipe details
    const recipeDetailButton = document.createElement('button');
    recipeDetailButton.classList.add('view-recipe-button');
    recipeDetailButton.innerHTML = 'View Recipe';

    // Assemble Recipe Card's DOM (as above structure reference)
    cardDiv.appendChild(cardBodyDiv);
    cardDiv.appendChild(cardFooterDiv);

    cardBodyDiv.appendChild(thumbnailImg);
    cardBodyDiv.appendChild(recipeTitleH4);
    cardBodyDiv.appendChild(timeP);
    cardBodyDiv.appendChild(recipeOwnerP);
    cardBodyDiv.appendChild(tagDiv);

    cardFooterDiv.appendChild(recipeDetailButton);

    // Attach to the appropriate recipe-row category
    // const exampleRecipeRow = document.querySelector(
    //     '#example-recipe > .recipe-row');
    // check if cardDiv generated properly
    // console.log(cardDiv);
    // exampleRecipeRow.appendChild(cardDiv);

    sectionRecipeDiv.appendChild(cardDiv);

    recipeCardDetail(recipeDetailButton, recipe);
  }
  console.log('done looping through recipes');
  const recipeCategoriesDiv = document.querySelector('#recipe-categories');
  recipeCategoriesDiv.insertBefore(section, recipeCategoriesDiv.firstChild);
}

/**
 * Search for recipes based on query.
 * @param {*} query query to search for recipes
 */
async function searchRecipes(query) {
  // const breakfastTest = await getRecipesByTag('Breakfast');
  // console.log(breakfastTest);
  if (!query) {
    showRecipesOnSearch(recipeData, 'All Recipes', query);
    return;
  }
  // Capitilized query (for search by tag)
  query = query.toLowerCase();
  query = query.charAt(0).toUpperCase() + query.slice(1);
  const array = [];
  let recipeDataBasedOnSearch;
  try {
    recipeDataBasedOnSearch = await getRecipesByName(query);
    if (Object.keys(recipeDataBasedOnSearch).length > 0) {
      // console.log(recipeDataBasedOnSearch);
      array.push(recipeDataBasedOnSearch);
    }
    recipeDataBasedOnSearch = await getRecipesByTag(query);
    if (Object.keys(recipeDataBasedOnSearch).length > 0) {
      // console.log(recipeDataBasedOnSearch);
      array.push(recipeDataBasedOnSearch);
    }
    recipeDataBasedOnSearch = await getRecipesByUserId(query);
    if (Object.keys(recipeDataBasedOnSearch).length > 0) {
      // console.log(recipeDataBasedOnSearch);
      array.push(recipeDataBasedOnSearch);
    }
  } catch (e) {
    throw (e);
  }
  // get unique recipes
  const unique = [...new Map(array.map((item) => [item['id'], item])).values()];
  if (unique.length > 0 ) {
    showRecipesOnSearch(unique[0], 'Search Results', query);
  } else {
    showRecipesOnSearch(recipeData, 'All Recipes', query);
  }
}

/**
 * Show the recipe cards based on search query.
 * @param {*} data recipes to display
 * @param {*} sectionName section where recipes should be displayed
 * @param {*} query search query
 */
async function showRecipesOnSearch(data, sectionName, query) {
  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('overlay');
  const loaderDiv = document.createElement('div');
  loaderDiv.classList.add('loader');
  const bodyHtml = document.querySelector('body');
  bodyHtml.classList.add('unscroll-body');
  overlayDiv.appendChild(loaderDiv);
  bodyHtml.appendChild(overlayDiv);

  // remove entire page's sections
  const recipeCategoriesDiv = document.querySelector('#recipe-categories');

  setTimeout(()=>{
    while (recipeCategoriesDiv.lastChild) {
      recipeCategoriesDiv.removeChild(recipeCategoriesDiv.lastChild);
    }
    createRecipeCard(data, sectionName);
    while (overlayDiv.hasChildNodes()) {
      overlayDiv.removeChild(overlayDiv.lastChild);
    }
    overlayDiv.remove();
    bodyHtml.classList.remove('unscroll-body');
    // if inserted a query that does not match any recipe, alert user
    if (query && sectionName == 'All Recipes') {
      alert('No matching recipes found...showing all recipes');
    }
  }, 500);
}

const uniqueFilters = new Set();
let filterRecipeArray = [];
/**
 * Search for a recipe by tag
 * @param {*} button button for the tag
 * @param {*} tagName name of the tag
 */
async function searchByTag(button, tagName) {
  // let recipeWithTag;
  // const recipeDataBasedOnSearch = await getRecipesByTag(tagName);
  // if (Object.keys(recipeDataBasedOnSearch).length > 0) {
  //   map[tagName] = recipeDataBasedOnSearch;
  // }
  // console.log(map);
  button.addEventListener('click', ()=>{
    for (const recipe of recipeData) {
      for (const tag in recipe.data.tags) {
        if (tagName == recipe.data.tags[tag]) {
          filterRecipeArray.push(recipe);
        }
      }
    }
    filterRecipeArray = [...new Map(filterRecipeArray.map((item) =>
      [item['id'], item])).values()];

    console.log(filterRecipeArray);

    const header = document.querySelector('header');
    let wrapper;
    let filterDiv;
    if (!document.querySelector('.wrapper')) {
      console.log('filter not found');
      wrapper = document.createElement('section');
      wrapper.classList.add('wrapper');
      filterDiv = document.createElement('div');
      filterDiv.classList.add('sticky-top');
      wrapper.appendChild(filterDiv);
      header.insertAdjacentElement('afterend', wrapper);
    } else {
      wrapper = document.querySelector('.wrapper');
      filterDiv = document.querySelector('.sticky-top');
    }
    console.log('tag button clicked');
    if (!uniqueFilters.has(button.innerHTML)) {
      const buttonDiv = document.createElement('div');
      const buttonClone = button.cloneNode(true);
      const closeButton = document.createElement('button');
      closeButton.innerHTML = 'x';
      console.log(buttonClone);
      uniqueFilters.add(buttonClone.innerHTML);
      buttonClone.classList.add('tag');
      buttonDiv.classList.add('filter-component');
      buttonDiv.appendChild(buttonClone);
      buttonDiv.appendChild(closeButton);
      filterDiv.appendChild(buttonDiv);

      showRecipesOnSearch(filterRecipeArray, 'Filter Results', null);

      removeFilterTag(closeButton, buttonClone.innerHTML,
          buttonDiv, filterDiv, wrapper);
    }
  });
}

/**
 * Removes a filter tag and recipes that are associated to it
 * @param {*} closeButton button to remove filter tag
 * @param {*} filterTagName selected filter tag name
 * @param {*} buttonDiv filter tag button to remove
 * @param {*} filterDiv div that contains all of the filter tags
 * @param {*} wrapper outer div of filter div
 */
async function removeFilterTag(closeButton, filterTagName,
    buttonDiv, filterDiv, wrapper) {
  closeButton.addEventListener('click', ()=>{
    while (buttonDiv.hasChildNodes()) {
      buttonDiv.removeChild(buttonDiv.lastChild);
      uniqueFilters.delete(filterTagName);
    }
    buttonDiv.remove();
    if (!filterDiv.hasChildNodes()) {
      filterDiv.remove();
      while (wrapper.hasChildNodes()) {
        wrapper.removeChild(wrapper.lastChild);
      }
      wrapper.remove();
    }

    // filter recipe
    /* filterRecipeArray = filterRecipeArray.
    filter(recipe => !(recipe.data.tags.includes(filterTagName)));
    */
    filterRecipeArray = [];
    for (const availTag of uniqueFilters) {
      for (const recipe of recipeData) {
        // console.log(availTag);
        for (const tag in recipe.data.tags) {
          if (availTag == recipe.data.tags[tag]) {
            filterRecipeArray.push(recipe);
          }
        }
      }
    }
    filterRecipeArray = [...new Map(filterRecipeArray.map((item) =>
      [item['id'], item])).values()];
    // console.log(filterRecipeArray);
    if (!filterRecipeArray.length) {
      showRecipesOnSearch(recipeData, 'All Recipes', null);
    } else {
      showRecipesOnSearch(filterRecipeArray, 'Filter Results', null);
    }
  });
}

/**
 * Recipe card details when user clicks on a recipe.
 * @param {*} recipeDetailButton button that the user clicks
 * @param {*} recipe recipe that is displayed to user
 */
async function recipeCardDetail(recipeDetailButton, recipe) {
  recipeDetailButton.addEventListener('click', ()=>{
    console.log('Hello!! I\'m clicked');
    console.log(recipe);
    /* *********************************** *
     * expand format:
     * <div>
     *      <div class='close-recipe-detail-div'>
     *          <button>X</button>
     *      </div>
     *      <div>
     *          <h4> {recipe's title} </h4>
     *          <img src='{recipe's thumbnail}'>
     *          <p> Cook/prep time </p>
     *          <p> {recipe's owner} </p>
     *          <div class='tags'>
     *              <button> {recipe's tag 1} </button>
     *              ... // more tags go here
     *          </div>
     *      </div>
     *      <div class='ingredients'>
     *          <h4>Ingredients:</h4>
     *          <ul>
     *              <li>{ingredient 1}</li>
     *          ... // more ingredients go here
     *          </ul>
     *      </div>
     *      <div class='instructions'>
     *          <h4>Instructions:</h4>
     *          <ul>
     *              <li>{instruction 1}</li>
     *              ... // more instructions go here
     *          </ul>
     *      </div>
     * </div>
     *
     * *********************************** */
    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('overlay');

    const closeRecipeExpandDiv = document.createElement('div');
    closeRecipeExpandDiv.classList.add('card-top');
    const closeRecipeExpandButton = document.createElement('button');
    closeRecipeExpandButton.classList.add('xbutton');
    closeRecipeExpandButton.innerHTML = 'X';

    const expandDiv = document.createElement('div');
    expandDiv.classList.add('expand-card');

    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('expand-body-section');
    bodyDiv.classList.add('expand-main');

    const recipeTitleH2 = document.createElement('h2');
    recipeTitleH2.innerHTML = recipe.data.name;
    recipeTitleH2.classList.add('recipe-title-capitalize');

    const thumbnailImg = document.createElement('img');
    thumbnailImg.setAttribute('src', recipe.data.imageURL);

    const timeP = document.createElement('p');
    timeP.innerHTML = `Total time: ${formatTime(recipe.data.cookTime)}`;

    const recipeOwnerP = document.createElement('p');
    recipeOwnerP.innerHTML = 'By ' + recipe.data.author.italics();

    // use loop to check for all tags
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tags');
    for (const tag in recipe.data.tags) {
      const tagButton = document.createElement('button');
      tagButton.innerHTML = recipe.data.tags[tag];
      tagButton.classList.add('tag');
      tagDiv.appendChild(tagButton);
      searchByTag(tagButton, tagButton.innerHTML);
    }
    const Description = document.createElement('h4');
    Description.innerHTML = 'Description';
    const DescriptionH4 = document.createElement('p');
    DescriptionH4.innerHTML = recipe.data.description;
    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('expand-main');
    const ingredientsH4 = document.createElement('h4');
    ingredientsH4.innerHTML = 'Ingredients:';

    const ingredientsUl = document.createElement('ul');

    ingredientsDiv.classList.add('ingredients-expand');
    for (const ingredient in recipe.data.recipeIngredient) {
      const ingredientLi = document.createElement('li');
      ingredientLi.innerHTML = recipe.data.recipeIngredient[ingredient];
      ingredientLi.classList.add('emoji');
      ingredientsUl.appendChild(ingredientLi);
    }

    const instructionsDiv = document.createElement('div');
    instructionsDiv.classList.add('expand-main');
    const instructionsH4 = document.createElement('h4');
    instructionsH4.innerHTML = 'Instructions:';
    instructionsDiv.classList.add('instructions-expand');
    const instructionsOl = document.createElement('ol');
    for (const instruction in recipe.data.recipeInstructions) {
      const instructionLi = document.createElement('li');
      instructionLi.innerHTML = recipe.data.recipeInstructions[instruction];
      instructionsOl.appendChild(instructionLi);
    }

    overlayDiv.appendChild(expandDiv);

    expandDiv.appendChild(closeRecipeExpandDiv);
    expandDiv.appendChild(bodyDiv);
    expandDiv.appendChild(Description);
    expandDiv.appendChild(DescriptionH4);
    expandDiv.appendChild(ingredientsDiv);
    expandDiv.appendChild(instructionsDiv);


    bodyDiv.appendChild(recipeTitleH2);
    bodyDiv.appendChild(thumbnailImg);
    bodyDiv.appendChild(timeP);
    bodyDiv.appendChild(recipeOwnerP);
    bodyDiv.appendChild(tagDiv);

    closeRecipeExpandDiv.appendChild(closeRecipeExpandButton);

    ingredientsDiv.appendChild(ingredientsH4);
    ingredientsDiv.appendChild(ingredientsUl);

    instructionsDiv.appendChild(instructionsH4);
    instructionsDiv.appendChild(instructionsOl);

    console.log(overlayDiv);

    // attach expanded view to body element
    const bodyHtml = document.querySelector('body');
    bodyHtml.appendChild(overlayDiv);

    // let overlayOpen = expandDiv.className === 'overlay';

    /* Toggle the aria-hidden state on the overlay and the
        no-scroll class on the body */
    bodyHtml.classList.add('unscroll-body');
    //  bodyHtml.classList.toggle('noscroll', overlayOpen);

    /* On some mobile browser when the overlay was previously
        opened and scrolled, if you open it again it doesn't
        reset its scrollTop property */
    //  overlayDiv.scrollTop = 0;


    removeExpandRecipe(closeRecipeExpandButton, overlayDiv, 'Escape');
  });
}

/**
 * Collapse expanded recipe.
 * @param {*} button button to collapse
 * @param {*} expandDiv div to remove expanded recipe from
 * @param {*} key key to collapse if pressed
 */
async function removeExpandRecipe(button, expandDiv, key) {
  button.addEventListener('click', ()=>{
    while (expandDiv.hasChildNodes()) {
      expandDiv.removeChild(expandDiv.lastChild);
    }
    expandDiv.remove();
    const bodyHtml = document.querySelector('body');
    bodyHtml.classList.remove('unscroll-body');
  });
  window.addEventListener('keydown', function(e) {
    if (e.key == key) {
      while (expandDiv.hasChildNodes()) {
        expandDiv.removeChild(expandDiv.lastChild);
      }
      expandDiv.remove();
      const bodyHtml = document.querySelector('body');
      bodyHtml.classList.remove('unscroll-body');
    }
  });
}

/**
 * Get total time from recipe's JSON object
 * @param {String} time: time as String
 * @return {String} reformatted time as String
 **/
function formatTime(time) {
  time = time.slice(2);
  const timeFormat = time.split('');
  for (let i=0; i < timeFormat.length; i++) {
    // remove 'R' in 'HR'
    if (timeFormat[i] == 'R') {
      timeFormat[i] = '';
      if (timeFormat[i-1] == ' hrs ' && i == timeFormat.length-1) {
        timeFormat[i-1] = ' hrs';
      }
      if (timeFormat[i-1] == ' hr ' && i == timeFormat.length-1) {
        timeFormat[i-1] = ' hr';
      }
    }
    if (timeFormat[i] == 'H') {
      timeFormat[i] = ' hr';
      if (parseInt(timeFormat[i-1]) > 1) {
        timeFormat[i] += 's';
      }
      // Handled 10-11 (two digits)
      if (parseInt(timeFormat[i-1])==0 || parseInt(timeFormat[i-1])==1) {
        if (timeFormat[i-2] && !isNaN(parseFloat(timeFormat[i-2]+timeFormat[i-1]) - (timeFormat[i-2]+timeFormat[i-1]))) { // eslint-disable-line max-len
          timeFormat[i] += 's';
        }
      }
      // Handle 12 hrs --> should be 12+ hrs
      if (parseInt(timeFormat[i-1])==2 && parseInt(timeFormat[i-2])==1) {
        timeFormat[i-1] += '+';
      }
      // if not the end of string, push a space
      if (i != timeFormat.length-1) {
        timeFormat[i] += ' ';
      }
    }
    if (timeFormat[i] == 'M') {
      timeFormat[i] = ' min';
      if (parseInt(timeFormat[i-1]) > 1) {
        timeFormat[i] += 's';
      }
      // Handled 10-11 (two digits)
      if (parseInt(timeFormat[i-1])==0 || parseInt(timeFormat[i-1])==1) {
        if (timeFormat[i-2] && !isNaN(parseFloat(timeFormat[i-2]+timeFormat[i-1]) - (timeFormat[i-2]+timeFormat[i-1]))) { // eslint-disable-line max-len
          timeFormat[i] += 's';
        }
      }
      if (i != timeFormat.length-1) {
        timeFormat[i] += ' ';
      }
    }
  }
  return timeFormat.join('');
}

/**
 * If user is logged in navigate to create new recipe page.
 * Otherwise, navigate to login page.
 */
function navigateCreateNewRecipe() { // eslint-disable-line no-unused-vars
  if (firebase.auth().currentUser) {
    window.location.href = 'new-recipe.html';
  } else {
    window.location.href = 'login.html';
  }
}

/**
 * If user is not logged in, navigate to the login page.
 */
function navigateLogin() { // eslint-disable-line no-unused-vars
  if (!firebase.auth().currentUser) {
    window.location.href = 'login.html';
  } else {
    logout();
  }
}

/**
 * If user is logged in navigate to my page
 * Otherwise, navigate to login page.
 */
function navigateMyPage() { // eslint-disable-line no-unused-vars
  if (firebase.auth().currentUser) {
    window.location.href = 'person.html';
  } else {
    window.location.href = 'login.html';
  }
}
