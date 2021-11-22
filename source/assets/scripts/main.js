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

    console.log('ingredients ', getIngredientsList(recipe));

    // for actual recipes from our app, use loop to check for all tags
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
  let unit = timeFormat.pop();
  if (unit == 'H') {
    unit = 'hr';
  }
  if (unit == 'M') {
    unit = 'min';
  }
  if (parseInt(timeFormat[0]) > 1) {
    unit += 's';
  }
  const editedUnit = ' '+unit;
  timeFormat.push(editedUnit);
  return timeFormat.join('');
}


// TODO: GET RECIPE'S OWNER FUNCTION

/**
 * Get all ingredients from recipe's JSON object
 * @param {Object} data: data as JSON Object
 * @return {Array} array of strings of ingredients
 **/
 function getIngredientsList(data){
  let ingredients;
  Object.keys(data).some((key)=>{
    if (key == 'recipeIngredient' && Array.isArray(data[key])) {
      ingredients = data[key];
      return true;
    }
    // recurse on data to get ingredients
    if (data[key] && typeof data[key] == 'object') {
      ingredients = getIngredientsList(data[key]);
      return ingredients !== undefined;
    }
  });
  return ingredients;
}
