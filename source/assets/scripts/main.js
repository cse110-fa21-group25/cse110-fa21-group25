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
      console.log(searchBar.value);
    }
  });

  console.log(Object.keys(recipeData).length);
  createRecipeCard();
}

// TODO: SPLIT BASED ON HOME-PAGE CATEGORIES
// (CLARIFY CATEGORIES (e.g. trending recipes, etc.))
/**
 * Creating recipe cards from the recipeData.
 */
async function createRecipeCard() {
  for (const recipe of recipeData) {
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

    const timeP = document.createElement('p');
    timeP.innerHTML = formatTime(recipe.data.cookTime);

    const recipeOwnerP = document.createElement('p');
    recipeOwnerP.innerHTML = 'By ' + recipe.data.author.italics();

    console.log('ingredients ', recipe.data.recipeIngredient);

    // use loop to check for all tags
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tags');
    for (const tag in recipe.data.tags) {
      const tagButton = document.createElement('button');
      tagButton.innerHTML = recipe.data.tags[tag];
      tagDiv.appendChild(tagButton);
    }

    const cardFooterDiv = document.createElement('div');
    cardFooterDiv.classList.add('card-footer');

    // SPA Button -- TODO: display recipe details
    const recipeDetailButton = document.createElement('button');
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
    const exampleRecipeRow = document.querySelector(
        '#example-recipe > .recipe-row');
    // check if cardDiv generated properly
    // console.log(cardDiv);
    exampleRecipeRow.appendChild(cardDiv);

    recipeCardDetail(recipeDetailButton, recipe);
  }
  console.log('done looping through recipes');
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
    const closeRecipeExpandButton = document.createElement('button');
    closeRecipeExpandButton.innerHTML = 'X';

    const expandDiv = document.createElement('div');
    expandDiv.classList.add('expand-card');

    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('expand-body-section');
    bodyDiv.classList.add('expand-main');

    const recipeTitleH2 = document.createElement('h2');
    recipeTitleH2.innerHTML = recipe.data.name;

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
      tagDiv.appendChild(tagButton);
    }

    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('expand-main');
    const ingredientsH4 = document.createElement('h4');
    ingredientsH4.innerHTML = 'Ingredients:';

    const ingredientsUl = document.createElement('ul');

    ingredientsDiv.classList.add('ingredients-expand');
    for (const ingredient in recipe.data.recipeIngredient) {
      const ingredientIl = document.createElement('li');
      ingredientIl.innerHTML = recipe.data.recipeIngredient[ingredient];
      ingredientsUl.appendChild(ingredientIl);
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // TODO: Get instructions from database!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const instructionsDiv = document.createElement('div');
    instructionsDiv.classList.add('expand-main');
    const instructionsH4 = document.createElement('h4');
    instructionsH4.innerHTML = 'Instructions:';
    instructionsDiv.classList.add('instructions-expand');
    const instructionsOl = document.createElement('ol');
    const step1 = document.createElement('li');
    const step2 = document.createElement('li');
    const step3 = document.createElement('li');
    const step4 = document.createElement('li');
    step1.innerHTML = 'Prepare.';
    step2.innerHTML = 'Cook.';
    step3.innerHTML = 'Serve.';
    step4.innerHTML = 'Feast!!';
    instructionsOl.appendChild(step1);
    instructionsOl.appendChild(step2);
    instructionsOl.appendChild(step3);
    instructionsOl.appendChild(step4);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // TODO: Get instructions from database!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    overlayDiv.appendChild(expandDiv);

    expandDiv.appendChild(closeRecipeExpandDiv);
    expandDiv.appendChild(bodyDiv);
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


    removeExpandRecipe(closeRecipeExpandButton, overlayDiv);
  });
}

/**
 * Collapse expanded recipe.
 * @param {*} button button to collapse
 * @param {*} expandDiv div to remove expanded recipe from
 */
async function removeExpandRecipe(button, expandDiv) {
  button.addEventListener('click', ()=>{
    while (expandDiv.hasChildNodes()) {
      expandDiv.removeChild(expandDiv.lastChild);
    }
    expandDiv.remove();
    const bodyHtml = document.querySelector('body');
    bodyHtml.classList.remove('unscroll-body');
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
