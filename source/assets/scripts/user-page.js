/* eslint-disable guard-for-in */
let recipeData;

if (typeof module !== 'undefined') {
  module.exports = {searchForKey};
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', init);
}

/**
 * Function that runs when DOM content is loaded
 * Populate the my recipes with the recipes that user has created
 */
async function init() {
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      recipeData = await getRecipesByUserId(user.uid);
      createRecipeCard();
      const searchBar = document.getElementById('search-bar');
      searchBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          searchRecipes(searchBar.value, user.uid);
        }
      });
    } else {
      console.error('user entered person\'s page without being logged in');
    }
  });
}

/**
 * Search for recipes based on query.
 * @param {*} query query to search for recipes
 * @param {*} id query to search for userID
 */
async function searchRecipes(query, id) {
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
      for (let i = 0; i < recipeDataBasedOnSearch.length; i++) {
        // console.log(recipeDataBasedOnSearch[i].data.userId);
        if (recipeDataBasedOnSearch[i].data.userId == id) {
          array.push(recipeDataBasedOnSearch[i]);
        }
      }
    }
    recipeDataBasedOnSearch = await getRecipesByTag(query);
    if (Object.keys(recipeDataBasedOnSearch).length > 0) {
      for (let i = 0; i < recipeDataBasedOnSearch.length; i++) {
        if (recipeDataBasedOnSearch[i].data.userId == id) {
          array.push(recipeDataBasedOnSearch[i]);
        }
      }
    }
    recipeDataBasedOnSearch = await getRecipesByUserId(query);
    if (Object.keys(recipeDataBasedOnSearch).length > 0) {
      for (let i = 0; i < recipeDataBasedOnSearch.length; i++) {
        if (recipeDataBasedOnSearch[i].data.userId == id) {
          array.push(recipeDataBasedOnSearch[i]);
        }
      }
    }
  } catch (e) {
    throw (e);
  }
  // get unique recipes
  const unique = [...new Map(array.map((item) => [item['id'], item])).values()];
  if (unique.length > 0) {
    showRecipesOnSearch(unique[0], 'Search Results', query);
  } else {
    showRecipesOnSearch(recipeData, 'All Recipes', query);
  }
}

/**
 * Search for recipes based on query.
 * @param {*} data data
 * @param {*} sectionName sectionName
 * @param {*} query query
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

  const recipeCategoriesDiv = document.querySelector('#created-recipes');
  setTimeout(()=>{
    while (recipeCategoriesDiv.lastChild) {
      recipeCategoriesDiv.removeChild(recipeCategoriesDiv.lastChild);
    }
    searchedRecipeCard(data);
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

/**
 * Search for recipes based on query.
 * @param {*} recipe query get recipe data
 */
async function searchedRecipe(recipe) {
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

  // Button to Delete Recipe
  const recipeDeleteButton = document.createElement('button');
  recipeDeleteButton.innerHTML = 'Delete Recipe';
  // recipeDeleteButton.onclick = deleteRecipe;

  // Button to update Recipe
  const recipeUpdateButton = document.createElement('button');
  recipeUpdateButton.innerHTML = 'Update Recipe';

  // Assemble Recipe Card's DOM (as above structure reference)
  cardDiv.appendChild(cardBodyDiv);
  cardDiv.appendChild(cardFooterDiv);

  cardBodyDiv.appendChild(thumbnailImg);
  cardBodyDiv.appendChild(recipeTitleH4);
  cardBodyDiv.appendChild(timeP);
  cardBodyDiv.appendChild(recipeOwnerP);
  cardBodyDiv.appendChild(tagDiv);

  cardFooterDiv.appendChild(recipeDetailButton);
  cardFooterDiv.appendChild(recipeDeleteButton);
  cardFooterDiv.appendChild(recipeUpdateButton);

  // Attach to the appropriate recipe-row category
  const searchedRecipeRow = document.querySelector('#created-recipes');
  const myRecipe = document.createElement('div');
  myRecipe.classList.add('my-recipe');
  searchedRecipeRow.appendChild(myRecipe);
  myRecipe.appendChild(cardDiv);
  // check if cardDiv generated properly

  recipeCardDetail(recipeDetailButton, recipe);
  deleteRecipe(recipeDeleteButton, recipe);
  updating(recipeUpdateButton, recipe);
}

/**
 * Search for recipes based on query.
 * @param {*} data data
 */
async function searchedRecipeCard(data) {
  if (!data.length) {
    searchedRecipe(data);
  } else {
    for (const recipe of data) {
      searchedRecipe(recipe);
    }
  }
}

/**
 * Works the same way as the one in main.js
 * It will search throguh recipeData and populate with recipeCards
 */
async function createRecipeCard() {
  for (const recipe of recipeData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.classList.add('col-md-3');
    cardDiv.classList.add('col-sm-6');
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

    // Button to Delete Recipe
    const recipeDeleteButton = document.createElement('button');
    recipeDeleteButton.innerHTML = 'Delete Recipe';
    // recipeDeleteButton.onclick = deleteRecipe;

    // Button to update Recipe
    const recipeUpdateButton = document.createElement('button');
    recipeUpdateButton.innerHTML = 'Update Recipe';

    // Assemble Recipe Card's DOM (as above structure reference)
    cardDiv.appendChild(cardBodyDiv);
    cardDiv.appendChild(cardFooterDiv);

    cardBodyDiv.appendChild(thumbnailImg);
    cardBodyDiv.appendChild(recipeTitleH4);
    cardBodyDiv.appendChild(timeP);
    cardBodyDiv.appendChild(recipeOwnerP);
    cardBodyDiv.appendChild(tagDiv);

    cardFooterDiv.appendChild(recipeDetailButton);
    cardFooterDiv.appendChild(recipeDeleteButton);
    cardFooterDiv.appendChild(recipeUpdateButton);

    // Attach to the appropriate recipe-row category
    const exampleRecipeRow = document.querySelector(
        '#created-recipes > .my-recipe');

    exampleRecipeRow.appendChild(cardDiv);
    recipeCardDetail(recipeDetailButton, recipe);
    deleteRecipe(recipeDeleteButton, recipe);
    updating(recipeUpdateButton, recipe);
  }
}

/**
 * Recipe card details when user clicks on a recipe.
 * @param {*} recipeDetailButton button that the user clicks
 * @param {*} recipe recipe that is displayed to user
 */
async function recipeCardDetail(recipeDetailButton, recipe) {
  recipeDetailButton.addEventListener('click', ()=>{
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

    // console.log(overlayDiv);

    // attach expanded view to body element
    const bodyHtml = document.querySelector('body');
    bodyHtml.appendChild(overlayDiv);

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
 * Function to delete the recipe that was clicked on
 * It will ask the user to confirm if they really want to delete
 * before deleting.
 *
 * @param {*} recipeDeleteButton button that the user clicks to delete
 * @param {*} recipe recipe that is displayed to user
 */
async function deleteRecipe(recipeDeleteButton, recipe) {
  recipeDeleteButton.addEventListener('click', ()=>{
    // console.log(recipe);
    // console.log(recipe.id);
    const result = confirm('Do you really want to delete this recipe?');
    if (result) {
      // delete the image and the recipe by id.
      deleteImage(recipe.data.imageURL);
      deleteRecipeById(recipe.id);
    }
  });
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

/**
 * Function to update the recipe that was clicked on.
 * It will take the recipedata and populate the form with it
 * Then it will allow user to update the recipe
 *
 * @param {*} recipeUpdateButton button that the user clicks to update
 * @param {*} recipe recipe that is displayed to user
 */
async function updating(recipeUpdateButton, recipe) {
  recipeUpdateButton.addEventListener('click', (e)=>{
    e.preventDefault();

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

    //  Make a header
    const header = document.createElement('header');
    const headerDiv = document.createElement('div');
    const headerH1 = document.createElement('h1');

    header.setAttribute('id', 'nav-placeholder');
    headerH1.innerHTML = recipe.data.name;
    header.appendChild(headerDiv);
    header.appendChild(headerH1);
    bodyDiv.appendChild(header);

    //  Make main

    const main = document.createElement('main');
    const mainForm = document.createElement('form');
    mainForm.setAttribute('id', 'recipeForm');
    const labelTitle = document.createElement('label');
    labelTitle.innerHTML = 'My Recipe Title:';
    const labelInput = document.createElement('input');
    labelInput.setAttribute('type', 'text');
    labelInput.setAttribute('name', 'recipe-title');
    labelInput.setAttribute('id', 'recipe-title');

    labelTitle.appendChild(labelInput);
    mainForm.appendChild(labelTitle);
    const br1 = document.createElement('br');
    mainForm.appendChild(br1);
    const br2 = document.createElement('br');
    mainForm.appendChild(br2);
    //  main_form.append(br);
    //  Label for author
    const labelAuthor = document.createElement('label');
    labelAuthor.innerHTML = 'Author:';
    const labelAuthorInput = document.createElement('input');
    labelAuthorInput.setAttribute('type', 'text');
    labelAuthorInput.setAttribute('name', 'author');
    labelAuthorInput.setAttribute('id', 'author');

    labelAuthor.appendChild(labelAuthorInput);
    mainForm.appendChild(labelAuthor);
    const br3 = document.createElement('br');
    mainForm.appendChild(br3);
    const br4 = document.createElement('br');
    mainForm.appendChild(br4);
    //  Element for description
    const pDescription = document.createElement('p');
    pDescription.innerHTML = 'Description:';
    const pDescriptionTextarea = document.createElement('textarea');
    pDescriptionTextarea.id = 'description';
    const someThing = 'Tell us a little bit about your recipe here!';
    pDescriptionTextarea.placeholder = someThing;
    pDescriptionTextarea.style = 'height: 70px; width: 300px';

    mainForm.appendChild(pDescription);
    mainForm.appendChild(pDescriptionTextarea);
    const br5 = document.createElement('br');
    mainForm.appendChild(br5);
    const br6 = document.createElement('br');
    mainForm.appendChild(br6);

    //  Element for tag

    const sectionTag = document.createElement('section');
    sectionTag.id = 'tag-section';
    const sectionTagLabel = document.createElement('label');
    sectionTagLabel.innerHTML = 'Tags:';
    sectionTag.appendChild(sectionTagLabel);
    const sectionTagSelect = document.createElement('select');
    sectionTagSelect.classList.add('tags');
    sectionTagSelect.id = 'tags';
    sectionTagSelect.multiple = 'yes';
    sectionTagSelect.style = 'vertical-align: middle; width: 120px';

    const tagOption0 = document.createElement('option');
    tagOption0.value = 0;
    tagOption0.innerHTML = 'Select Tags:';
    sectionTagSelect.appendChild(tagOption0);

    const tagOption1 = document.createElement('option');
    tagOption1.value = 1;
    tagOption1.innerHTML = 'Breakfast';
    sectionTagSelect.appendChild(tagOption1);

    const tagOption2 = document.createElement('option');
    tagOption2.value = 2;
    tagOption2.innerHTML = 'Dessert';
    sectionTagSelect.appendChild(tagOption2);

    const tagOption3 = document.createElement('option');
    tagOption3.value = 3;
    tagOption3.innerHTML = 'Dinner';
    sectionTagSelect.appendChild(tagOption3);

    const tagOption4 = document.createElement('option');
    tagOption4.value = 4;
    tagOption4.innerHTML = 'Easy';
    sectionTagSelect.appendChild(tagOption4);

    const tagOption5 = document.createElement('option');
    tagOption5.value = 5;
    tagOption5.innerHTML = 'Healthy';
    sectionTagSelect.appendChild(tagOption5);

    const tagOption6 = document.createElement('option');
    tagOption6.value = 6;
    tagOption6.innerHTML = 'Lunch';
    sectionTagSelect.appendChild(tagOption6);

    const tagOption7 = document.createElement('option');
    tagOption7.value = 7;
    tagOption7.innerHTML = 'Quick';
    sectionTagSelect.appendChild(tagOption7);

    const tagOption8 = document.createElement('option');
    tagOption8.value = 8;
    tagOption8.innerHTML = 'Snack';
    sectionTagSelect.appendChild(tagOption8);

    sectionTag.appendChild(sectionTagSelect);

    const tagButton = document.createElement('button');
    tagButton.id = 'add-tag';
    tagButton.addEventListener('click', addTag);
    tagButton.type = 'button';
    tagButton.innerHTML = 'Add Tag(s)';
    sectionTag.appendChild(tagButton);

    const tagDiv = document.createElement('div');
    tagDiv.id = 'selected-tags';
    sectionTag.appendChild(tagDiv);
    mainForm.appendChild(sectionTag);

    const br7 = document.createElement('br');
    mainForm.appendChild(br7);
    const br8 = document.createElement('br');
    mainForm.appendChild(br8);

    //  Element for Ingredients

    const ingredientLabel = document.createElement('label');
    ingredientLabel.innerHTML = 'Ingredients';
    mainForm.appendChild(ingredientLabel);

    const sectionIngredient = document.createElement('section');
    sectionIngredient.setAttribute('name', 'ingredients');

    const sectionIngredientDiv = document.createElement('div');
    sectionIngredientDiv.classList.add('ingredients-field');
    const sectionIngredientDivDiv = document.createElement('div');
    const sectionIngredientDivDivInput = document.createElement('input');
    sectionIngredientDivDivInput.setAttribute('type', 'text');
    sectionIngredientDivDivInput.classList.add('ingredient');
    sectionIngredientDivDivInput.setAttribute('placeholder', 'Ingredient Name');
    sectionIngredientDivDivInput.setAttribute('id', 'ingredient1');
    sectionIngredientDivDiv.appendChild(sectionIngredientDivDivInput);
    sectionIngredientDiv.appendChild(sectionIngredientDivDiv);
    sectionIngredient.appendChild(sectionIngredientDiv);
    const ingredientAddButton = document.createElement('button');
    ingredientAddButton.setAttribute('type', 'button');
    ingredientAddButton.innerHTML = 'Add Ingredient';
    ingredientAddButton.id = 'add-ingredient';
    ingredientAddButton.addEventListener('click', addIngredient);
    sectionIngredient.appendChild(ingredientAddButton);

    const ingredientRemoveButton = document.createElement('button');
    ingredientRemoveButton.setAttribute('type', 'button');
    ingredientRemoveButton.innerHTML = 'Remove Ingredient';
    ingredientRemoveButton.id = 'remove-ingredient';
    ingredientRemoveButton.addEventListener('click', removeIngredient);
    sectionIngredient.appendChild(ingredientRemoveButton);

    mainForm.appendChild(sectionIngredient);

    const br9 = document.createElement('br');
    mainForm.appendChild(br9);
    const br10 = document.createElement('br');
    mainForm.appendChild(br10);

    //  Make a Cook Time element

    const timeLabel = document.createElement('label');
    timeLabel.innerHTML = 'Cook Time: ';
    mainForm.appendChild(timeLabel);

    const divTime = document.createElement('div');
    divTime.classList.add('cook-time');
    divTime.setAttribute('id', 'cook-time');

    const divTimeSelectHour = document.createElement('select');
    divTimeSelectHour.setAttribute('id', 'num-hours');

    for ( let i = 0; i < 13; i ++ ) {
      const divTimeSelectHourOption= document.createElement('option');
      divTimeSelectHourOption.value = i;
      divTimeSelectHourOption.innerHTML = i + '  hours';
      divTimeSelectHour.appendChild(divTimeSelectHourOption);
    }
    divTime.appendChild(divTimeSelectHour);

    const divTimeSelectMins = document.createElement('select');
    divTimeSelectMins.setAttribute('id', 'num-minutes');

    for ( let i = 0; i < 12; i ++ ) {
      const divTimeSelectMinsOption= document.createElement('option');
      divTimeSelectMinsOption.value = i;
      divTimeSelectMinsOption.innerHTML = i*5 + '  mins';
      divTimeSelectMins.appendChild(divTimeSelectMinsOption);
    }
    divTime.appendChild(divTimeSelectMins);
    mainForm.appendChild(divTime);
    const br11 = document.createElement('br');
    mainForm.appendChild(br11);
    const br12 = document.createElement('br');
    mainForm.appendChild(br12);

    //  Elements for steps

    const stepsLabel = document.createElement('label');
    stepsLabel.innerHTML = 'Steps:';

    const sectionSteps = document.createElement('section');
    sectionSteps.setAttribute('name', 'steps');

    const sectionStepsDiv = document.createElement('div');
    sectionStepsDiv.classList.add('recipe-steps');
    const sectionStepsDivDiv = document.createElement('div');
    const sectionStepsDivDivLabel = document.createElement('label');
    sectionStepsDivDivLabel.innerHTML = '1. ';
    sectionStepsDivDiv.appendChild(sectionStepsDivDivLabel);
    const sectionStepsDivDivTextarea = document.createElement('textarea');
    sectionStepsDivDivTextarea.classList.add('steps');
    const height = 'height: 70px;';
    const width = ' width: 300px;';
    const vertical = ' vertical-align: middle';
    sectionStepsDivDivTextarea.style = height + width + vertical;
    const firstEx= 'Add the first step of creating ';
    const secondEx= 'your recipe here!';
    sectionStepsDivDivTextarea.placeholder = firstEx + secondEx;
    sectionStepsDivDivTextarea.id = 'step1';

    sectionStepsDivDiv.appendChild(sectionStepsDivDivTextarea);

    sectionStepsDiv.appendChild(sectionStepsDivDiv);
    sectionSteps.appendChild(sectionStepsDiv);

    const sectionStepsAddButton = document.createElement('button');
    sectionStepsAddButton.id = 'add-step';
    sectionStepsAddButton.addEventListener('click', addStep);
    sectionStepsAddButton.type = 'button';
    sectionStepsAddButton.innerHTML = 'Add Step';
    sectionSteps.appendChild(sectionStepsAddButton);

    const sectionStepsRemoveButton = document.createElement('button');
    sectionStepsRemoveButton.id = 'remove-step';
    sectionStepsRemoveButton.addEventListener('click', removeStep);
    sectionStepsRemoveButton.type = 'button';
    sectionStepsRemoveButton.innerHTML = 'Remove Step';
    sectionSteps.appendChild(sectionStepsRemoveButton);

    mainForm.appendChild(sectionSteps);

    const br13 = document.createElement('br');
    mainForm.appendChild(br13);
    const br14 = document.createElement('br');
    mainForm.appendChild(br14);

    // Element for uploading Image

    const fileLabel = document.createElement('lapbel');
    const q = 'Please upload your new recipe image if you would like to change';
    fileLabel.innerHTML = q;
    mainForm.appendChild(fileLabel);

    const fileLabelInput = document.createElement('input');
    fileLabelInput.type = 'file';
    fileLabelInput.accept = 'image/png,image/jpeg';
    fileLabelInput.setAttribute('id', 'recipe-image');
    mainForm.appendChild(fileLabelInput);
    const br15 = document.createElement('br');
    mainForm.appendChild(br15);
    const br16 = document.createElement('br');
    mainForm.appendChild(br16);

    const updateButton = document.createElement('button');
    updateButton.type = 'click';
    updateButton.id = 'update-recipe';
    updateButton.innerHTML = 'Update';

    updateButton.addEventListener('click', function(event) {
      event.preventDefault();
      const allInputs = document.querySelectorAll('.ingredients-field input');
      const recipeInput = Array.from(allInputs);

      // Take all the inputs and make it a key value pair, scrape data
      // Then build an array of strings with the ingredients as the entries.
      const formattedIngredients = recipeInput.reduce((acc, input) =>
        ({...acc, [input.id]: input.value}), {});
      const ingredientArray = [];

      // const allIPlaceholder = document.querySelectorAll(
      //     '.ingredients-field placeholder');
      const formattedIngredientsPlaceholder = recipeInput.reduce((acc, input) =>
        ({...acc, [input.id]: input.placeholder}), {});


      for (const currIngred in formattedIngredientsPlaceholder) {
        if (formattedIngredients[currIngred]) {
          ingredientArray.push(formattedIngredients[currIngred]);
        } else {
          ingredientArray.push(formattedIngredientsPlaceholder[currIngred]);
        }
      }

      console.log(ingredientArray);

      // Take all the "textarea" elements within .recipeSteps scrape data
      // Then build a string int he format that the JSON schema expects
      const allTextAreas = document.querySelectorAll('.recipe-steps textarea');
      const recipeTextArea = Array.from(allTextAreas);
      const formattedSteps = recipeTextArea.reduce((acc, textarea) =>
        ({...acc, [textarea.id]: textarea.value}), {});
      const stepString = [];
      for (const currStep in formattedSteps) {
        if (formattedSteps[currStep]) {
          stepString.push(formattedSteps[currStep]);
        }
      }
      // convert cooktime to ISO 8601 Duration format
      const numHours = document.querySelector('#num-hours').value;
      const numMinutes = document.querySelector('#num-minutes').value * 5;
      let cookTime;
      if (numHours == 0 && numMinutes != 0) {
        cookTime = 'PT' + numMinutes + 'M';
      } else if (numHours != 0 && numMinutes == 0) {
        cookTime = 'PT' + numHours + 'H';
      } else if (numHours == 0 && numMinutes == 0) {
        alert('Cook Time cannot be Blank!');
      } else {
        cookTime = 'PT' + numHours + 'H' + numMinutes + 'M';
      }

      console.log(cookTime);
      // Get the image, serverside implementation needed
      const recipeImage = document.querySelector('#recipe-image');
      // Retrieve all the tags selected
      const tags = document.querySelectorAll('#selected-tags div');
      const tagArray = [];
      for (let i = 0; i < tags.length; i++) {
        tagArray.push(tags[i].textContent.slice(0, -1));
      }

      // Start building JSON string first from object, fill out the form values.

      console.log(recipe.data);
      recipe.data.tags = tagArray;
      recipe.data.name = document.querySelector('#recipe-title').value;
      recipe.data.author = document.querySelector('#author').value;
      recipe.data.description = document.querySelector('#description').value;
      recipe.data.datePublished = new Date();
      recipe.data.cookTime = cookTime;
      recipe.data.recipeIngredient = ingredientArray;
      recipe.data.recipeInstructions = stepString;
      console.log(recipe.data);

      const userID = firebase.auth().currentUser.uid;

      // If user has not uploaded in recipes throw alert.
      if (!recipeImage.files[0]) {
        updateRecipe(recipe).then(()=>{
          window.location.reload();
        });
      } else {
        // Upload image to server, once that process is complete (async),
        // write the object to database
        const ref = storage.ref().child(`images/${recipe.data.name}-${userID}`);
        const uploadTask = ref.put(recipeImage.files[0]);
        uploadTask.on('state_changed',
            (snapshot) => {
              const a = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
              const progress = a;
              console.log(progress + '% done');
            },
            (error) => {
              console.error('Error uploading image: ' + error);
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('Successfully uploaded image at: ' + downloadURL);

                // once the image is uploaded, we retrieve the download URL
                // and attach it to the object, then push object to DB
                recipe.data.imageURL = downloadURL;
                updateRecipe(recipe).then(()=>{
                  window.location.reload();
                });
                alert('Succesfully Updated Recipe!');
              });
            },
        );
      }
    });

    mainForm.appendChild(updateButton);

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.id = 'cancel-recipe';
    cancelButton.innerHTML = 'Canel';

    mainForm.appendChild(cancelButton);
    main.appendChild(mainForm);
    bodyDiv.appendChild(main);
    overlayDiv.appendChild(expandDiv);
    expandDiv.appendChild(closeRecipeExpandDiv);
    expandDiv.appendChild(bodyDiv);
    closeRecipeExpandDiv.appendChild(closeRecipeExpandButton);


    console.log(bodyDiv);

    // attach expanded view to body element
    const bodyHtml = document.querySelector('body');
    bodyHtml.appendChild(overlayDiv);

    bodyHtml.classList.add('unscroll-body');

    loadingAuthorHtml(recipe);
    loadingTitleHtml(recipe);
    loadingTagHtml(recipe);
    loadingTimeHtml(recipe);
    loadingDescriptionHtml(recipe);
    loadingIngredientHtml(recipe);
    loadingStepHtml(recipe);
    loadingAuthorHtml(recipe);

    removeExpandRecipe(closeRecipeExpandButton, overlayDiv);
    removeExpandRecipe(cancelButton, overlayDiv);
  });
}

/**
   * Getting Ingredient from JSON file and load time to HTML
   * @param {*} object
   */
function loadingIngredientHtml(object) {
  const ingredientList = searchForKey(object, 'recipeIngredient');
  for (const key in ingredientList) {
    /* <input type="text" class="ingredient"
    placeholder="Ingredient Name" id="ingredient1">
    */

    // First block is already there. So no need to make new createElement
    if (key == 0 ) {
      const temp = document.querySelector('.ingredients-field input');
      temp.id = 'ingredient' + 1;
      // set classes
      temp.placeholder = ingredientList[key];
    } else {
      const newField = document.createElement('div');
      const newIngredient = document.createElement('input');

      // Populate Input Fields
      newIngredient.type = 'text';
      newIngredient.id = 'ingredient' + key + 1;
      // set classes
      newIngredient.className = 'ingredient';

      // Replace placeholder with ingredientList[key]
      newIngredient.placeholder = ingredientList[key];

      // Append to HTML doc
      newField.appendChild(newIngredient);
      document.querySelector('.ingredients-field').appendChild(newField);
    }
  }
}

/**
 * Getting steps from JSON file and load time to HTML
 * @param {*} object
 */
function loadingStepHtml(object) {
  const stepsList = searchForKey(object, 'recipeInstructions');

  for (const key in stepsList) {
    /* <textarea class="steps" style="height:70px; width:300px;
    vertical-align: middle"
    placeholder='Add the first step of creating your recipe here!'
    id="step1"></textarea>
    */

    // First block is already there. So no need to make new createElement
    if (key == 0 ) {
      const temp = document.querySelector('.recipe-steps textarea');
      temp.id = 'step' + 1;
      // set classes
      temp.innerHTML = stepsList[key];
    } else {
      const newField = document.createElement('div');
      const newStep = document.createElement('textarea');
      const newLabel = document.createElement('label');
      const parentDiv = document.querySelector('.recipe-steps');

      // Set the step label to be the number of "steps" fields there will be.
      newLabel.textContent = (parentDiv.childElementCount + 1) + '.' + ' ';

      // Style the new step box
      newStep.style = 'height:70px; width:300px ';
      newStep.setAttribute('vertical-align', 'middle');

      // Populate Input Fields
      newStep.id = 'step' + key + 1;

      // set classes
      newStep.className = 'steps';
      newStep.innerHTML = stepsList[key];

      // Append to HTML doc
      newField.appendChild(newLabel);
      newField.appendChild(newStep);
      document.querySelector('.recipe-steps').appendChild(newField);
    }
  }
}


/**
   * Getting Tag from JSON file and load time to HTML
   * @param {*} object
   */
function loadingTagHtml(object) {
  const tagsList = searchForKey(object, 'tags');
  for (const i in tagsList) { // eslint-disable-line guard-for-in
    // Adding that the tag is selected
    const tagsDiv = document.querySelector('#selected-tags');
    const newTag = document.createElement('div');
    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.onclick = deleteTag;
    newButton.textContent = 'x';
    newTag.textContent = tagsList[i];
    newTag.appendChild(newButton);
    tagsDiv.appendChild(newTag);
  }
}

/**
   * Getting Tag from JSON file and load time to HTML
   * @param {*} object
   */
function loadingTitleHtml(object) {
  document.querySelector('#recipe-title').value = searchForKey(object, 'name');
}


/**
   * Getting Tag from JSON file and load time to HTML
   * @param {*} object
   */
function loadingAuthorHtml(object) {
  document.querySelector('#author').value = searchForKey(object, 'author');
}

/**
   * Getting Description from JSON file and load time to HTML
   * @param {*} object
   */
function loadingDescriptionHtml(object) {
  document.querySelector('#description').value = searchForKey(object,
      'description');
}

/**
   * Getting cooking time from JSON file and load time to HTML
   * @param {*} object
   */
function loadingTimeHtml(object) {
  let hour='';
  let min='';
  let time = searchForKey(object, 'cookTime');
  console.log(time);

  // Remove PT
  time = time.slice(2);

  // Getting Hour
  for (const a in time) {
    if (time[a] == 'H') {
      for (let i = 0; i < a; i ++ ) {
        hour += time[i];
      }
      for (let i = hour.length+1; i < time.length-1; i ++ ) {
        min += time[i];
      }
    }
  }

  if (min == '' && hour == '') {
    for (const a in time) {
      if (time[a] == 'M') {
        for (let i = 0; i<a; i ++ ) {
          min += time[i];
        }
      }
    }
  }
  // Updaing these two value to HTML form
  if ( hour != '') {
    document.querySelector('#num-hours').value = hour;
    document.querySelector('#num-minutes').value = min / 5;
  } else {
    document.querySelector('#num-minutes').value = min / 5;
  }
}

/**
 * Function to search for a key.
 * @param {*} object
 * @param {*} key
 * @return {*} value found at key
 */
function searchForKey(object, key) {
  let value;
  Object.keys(object).some(function(k) {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = searchForKey(object[k], key);
      return value !== undefined;
    }
  });
  return value;
}
/**
   * Function to remove a tag when the corresponding button is clicked
   */
function deleteTag() {
  const parent = this.parentNode; // eslint-disable-line no-invalid-this
  const grandParent = parent.parentNode;
  grandParent.removeChild(parent);
}
/**
   * Function to allow the user to use a multiple select and select multiple
   * tags for their recipes. The multiselect prohibits the default tag
   * "select tags" from being selected. It also will prohibit duplicate tags
   * It will add the tag as a <div> with a button that is linked to it.
   * This button is linked to deleteTag so it will remove the tag onclick.
   */
function addTag() {
  const tagsDiv = document.querySelector('#selected-tags');
  const itemList = document.getElementById('tags');
  const collection = itemList.selectedOptions;
  for (let i = 0; i < collection.length; i++) {
    const currLabel = collection[i].label;
    // shouldn't add the "select tags: option" or any tags already added
    if (currLabel != 'Select Tags:') {
      // prevent duplicate
      const tags = document.querySelectorAll('#selected-tags div');
      if (tags.length) {
        // search through div to make sure no dupilcates are added
        for (let j = 0; j < tags.length; j++) {
          const divLabel = tags[j].textContent.slice(0, -1);
          if (currLabel == divLabel) {
            // remove old elements
            tags[j].remove();
          }
        }
      }
      // add elements also add a button to remove
      // the tag.
      const newTag = document.createElement('div');
      const newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.onclick = deleteTag;
      newButton.textContent = 'x';
      newTag.textContent = currLabel;
      newTag.appendChild(newButton);
      tagsDiv.appendChild(newTag);
    }
  }
}
/**
   *  Function to append a new input to the Ingredients part of the form.
   *  On button click, a new Ingredient form will appear along with its
   *  corresponding input fields.
   */
function addIngredient() {
  // Create HTML elements
  const newField = document.createElement('div');
  const newIngredient = document.createElement('input');
  // Populate Input Fields
  newIngredient.type = 'text';
  // set classes
  newIngredient.className = 'ingredient';
  // set unique id's, the name of the ingredient is ingredient
  // + number of children the parent div will
  // have after these elements are added.
  const idNum = document.querySelector('.ingredients-field').childElementCount +
    1;
  newIngredient.id = 'ingredient' + idNum;
  // Append to HTML doc
  newField.appendChild(newIngredient);
  document.querySelector('.ingredients-field').appendChild(newField);
}
/**
   * Just removes the last element (bottom-most) from the Ingredients input
   * fields. You can remove any of the HTML elements added
   *  but not the first one.
   */
function removeIngredient() {
  // Return without doing anything if there is only one element
  if (document.querySelector('.ingredients-field').childElementCount === 1) {
    return;
  }
  const remove = document.querySelector('.ingredients-field');
  remove.removeChild(remove.lastChild);
}
/**
   * Dynamically adds additional steps to the HTML document.
   */
function addStep() {
  // Create HTML elements
  const newField = document.createElement('div');
  const label = document.createElement('label');
  const newStep = document.createElement('textarea');
  const parentDiv = document.querySelector('.recipe-steps');
  // Set the step label to be the number of "steps" fields there will be.
  label.textContent = (parentDiv.childElementCount + 1) + '. ';
  // Adjust some basic styles for  the textarea element
  newStep.style.height = '70px';
  newStep.style.width = '300px';
  newStep.style.verticalAlign = 'middle';
  // Add unique id's to the textareas, the id is "step" and the step number
  const idNum = document.querySelector('.recipe-steps').childElementCount + 1;
  newStep.id = 'step' + idNum;
  // Append HTMl elements to DOM
  newField.appendChild(label);
  newField.appendChild(newStep);
  document.querySelector('.recipe-steps').appendChild(newField);
}
/**
   * Just removes the last element (bottom-most) from the Steps input fields.
   * You can remove any of the HTML elements added but not the first one.
   */
function removeStep() {
  // Return without doing anything if there is only one element
  if (document.querySelector('.recipe-steps').childElementCount === 1) {
    return;
  }

  const remove = document.querySelector('.recipe-steps');
  remove.removeChild(remove.lastChild);
}
