/* eslint-disable guard-for-in */
let recipeData;

window.addEventListener('DOMContentLoaded', init);
/**
 * Initialization to fetch the recipes and create recipe cards.
 */
async function init() {
  try {
    recipeData = await getAllRecipes();
  } catch (e) {
    throw (e);
  }

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

    console.log('ingredients ', recipe.data.ingredients);

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
  }
  console.log('done looping through recipes');
}

/**
 * Get total time from recipe's JSON object
 * @param {String} time: time as String
 * @return {String} reformatted time as String
 **/
function formatTime(time) {
  time = time.slice(2);
  const timeFormat = time.split('');
  for(let i=0; i < timeFormat.length; i++){
    if (timeFormat[i] == 'H') {
      timeFormat[i] = ' hr';
      if(parseInt(timeFormat[i-1]) > 1){
        timeFormat[i] += 's';
      }
      if(i != timeFormat.length-1){
        timeFormat[i] += ' ';
      }
    }
    if (timeFormat[i] == 'M') {
      timeFormat[i] = ' min';
      if(parseInt(timeFormat[i-1]) > 1){
        timeFormat[i] += 's';
      }
      if(i != timeFormat.length-1){
        timeFormat[i] += ' ';
      }
    }
  }
  return timeFormat.join('');
}