/* eslint-disable guard-for-in */
let recipeData;

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
    } else {
      // User is signed out.
      console.error('user entered person\'s page without being logged in');
    }
  });
}

/**
 * Works the same way as the one in main.js
 * It will search throguh recipeData and populate with recipeCards
 */
async function createRecipeCard() {
  for (const recipe of recipeData) {
    // console.log(recipe);
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

    // console.log('ingredients ', recipe.data.recipeIngredient);

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

    //Button to update Recipe
    const recipeUpdateButton = document.createElement("button");
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
    // check if cardDiv generated properly
    // console.log(cardDiv);
    exampleRecipeRow.appendChild(cardDiv);

    recipeCardDetail(recipeDetailButton, recipe);
    deleteRecipe(recipeDeleteButton, recipe);
    updating(recipeUpdateButton,recipe);
  }
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

    //Make a header 
    
    const header = document.createElement('header');
    const header_div = document.createElement("div");
    const header_h1 = document.createElement("h1");

    
    header.setAttribute("id","nav-placeholder");
    header_h1.innerHTML = "Update New Recipe";
    header.append(header_div);
    header.append(header_h1);
    bodyDiv.append(header);

    //Make main

    const main = document.createElement("main");
    const main_form = document.createElement("form");
    main_form.setAttribute("id","recipeForm")
    const label_title = document.createElement("label");
    label_title.innerHTML = "My Recipe Title:";
    const label_input = document.createElement("input");
    label_input.setAttribute("type","text");
    label_input.setAttribute("name", "recipe-title" );
    label_input.setAttribute("id", "recipe-title" );

    label_title.append(label_input);
    main_form.append(label_title);
    const br1 = document.createElement('br');
    main_form.append(br1);
    const br2 = document.createElement('br');
    main_form.append(br2);
    //main_form.append(br);
    
    //Label for author
    const label_author = document.createElement("label");
    label_author.innerHTML = "Author:";
    const label_author_input = document.createElement("input");
    label_author_input.setAttribute("type","text");
    label_author_input.setAttribute("name","author");
    label_author_input.setAttribute("id","author");

    label_author.append(label_author_input);
    main_form.append(label_author);
    const br3 = document.createElement('br');
    main_form.append(br3);
    const br4 = document.createElement('br');
    main_form.append(br4);
  
    //Element for description

    const p_description = document.createElement("p");
    p_description.innerHTML = "Description:";
    const p_description_textarea = document.createElement("textarea");
    p_description_textarea.id = "description";
    p_description_textarea.placeholder = "Tell us a little bit about your recipe here!";
    p_description_textarea.style = "height: 70px; width: 300px";

    main_form.append(p_description);
    main_form.append(p_description_textarea);
    const br5 = document.createElement('br');
    main_form.append(br5);
    const br6 = document.createElement('br');
    main_form.append(br6);

    //Element for tag
    const section_tag = document.createElement("section");
    section_tag.id = "tag-section";
    const section_tag_label = document.createElement("label");
    section_tag_label.innerHTML = "Tags:";
    section_tag.append(section_tag_label);
    const section_tag_select = document.createElement("select");
    section_tag_select.classList.add("tags");
    section_tag_select.id = "tags";
    section_tag_select.multiple = "yes";
    section_tag_select.style = "vertical-align: middle; width: 120px";

    const tag_option0 = document.createElement("option");
    tag_option0.value = 0;
    tag_option0.innerHTML = "Select Tags:";
    section_tag_select.append(tag_option0);

    const tag_option1 = document.createElement("option");
    tag_option1.value = 1;
    tag_option1.innerHTML = "Breakfast";
    section_tag_select.append(tag_option1);

    const tag_option2 = document.createElement("option");
    tag_option2.value = 2;
    tag_option2.innerHTML = "Dessert";
    section_tag_select.append(tag_option2);

    const tag_option3 = document.createElement("option");
    tag_option3.value = 3;
    tag_option3.innerHTML = "Dinner";
    section_tag_select.append(tag_option3);

    const tag_option4 = document.createElement("option");
    tag_option4.value = 4;
    tag_option4.innerHTML = "Easy";
    section_tag_select.append(tag_option4);

    const tag_option5 = document.createElement("option");
    tag_option5.value = 5;
    tag_option5.innerHTML = "Healthy";
    section_tag_select.append(tag_option5);

    const tag_option6 = document.createElement("option");
    tag_option6.value = 6;
    tag_option6.innerHTML = "Lunch";
    section_tag_select.append(tag_option6);

    const tag_option7 = document.createElement("option");
    tag_option7.value = 7;
    tag_option7.innerHTML = "Quick";
    section_tag_select.append(tag_option7);

    const tag_option8 = document.createElement("option");
    tag_option8.value = 8;
    tag_option8.innerHTML = "Snack";
    section_tag_select.append(tag_option8);

    section_tag.append(section_tag_select);

    const tag_button = document.createElement("button");
    tag_button.id = "add-tag";
    tag_button.addEventListener('click', addTag);
    tag_button.type = "button";
    tag_button.innerHTML = "Add Tag(s)";
    section_tag.append(tag_button);

    const tag_div = document.createElement("div");
    tag_div.id = "selected-tags";
    section_tag.append(tag_div);
    main_form.append(section_tag);

    const br7 = document.createElement('br');
    main_form.append(br7);
    const br8 = document.createElement('br');
    main_form.append(br8);

    //Element for Ingredients

    const ingredient_label = document.createElement("label");
    ingredient_label.innerHTML = "Ingredients";
    main_form.append(ingredient_label);

    const section_ingredient = document.createElement("section");
    section_ingredient.setAttribute("name", "ingredients");

    const section_ingredient_div = document.createElement("div");
    section_ingredient_div.classList.add("ingredients-field");
    
    const section_ingredient_div_div = document.createElement("div");

    const section_ingredient_div_div_input = document.createElement("input");
    section_ingredient_div_div_input.setAttribute("type","text");
    section_ingredient_div_div_input.classList.add("ingredient");
    section_ingredient_div_div_input.setAttribute("placeholder","Ingredient Name");
    section_ingredient_div_div_input.setAttribute("id","ingredient1");
    
    section_ingredient_div_div.append(section_ingredient_div_div_input);

    section_ingredient_div.append(section_ingredient_div_div);
    section_ingredient.append(section_ingredient_div);
    
    const ingredient_add_button = document.createElement("button");
    ingredient_add_button.setAttribute("type","button");
    ingredient_add_button.innerHTML = "Add Ingredient";
    ingredient_add_button.id = "add-ingredient";
    ingredient_add_button.addEventListener('click', addIngredient);

    section_ingredient.append(ingredient_add_button);

    const ingredient_remove_button = document.createElement("button");
    ingredient_remove_button.setAttribute("type","button");
    ingredient_remove_button.innerHTML = "Remove Ingredient";
    ingredient_remove_button.id = "remove-ingredient";
    ingredient_remove_button.addEventListener('click', removeIngredient);
    section_ingredient.append(ingredient_remove_button);

    main_form.append(section_ingredient);

    const br9 = document.createElement('br');
    main_form.append(br9);
    const br10 = document.createElement('br');
    main_form.append(br10);

    //Make a Cook Time element

    const time_label = document.createElement("label");
    time_label.innerHTML = "Cook Time: ";
    main_form.append(time_label);

    const div_time = document.createElement("div");
    div_time.classList.add("cook-time");
    div_time.setAttribute("id","cook-time");

    div_time_select_hour = document.createElement("select");
    div_time_select_hour.setAttribute("id","num-hours");

    for( let i = 0; i < 13 ; i ++ )
    {
      let div_time_select_hour_option= document.createElement("option");
      div_time_select_hour_option.value = i;
      div_time_select_hour_option.innerHTML = i + "  hours";
      div_time_select_hour.append(div_time_select_hour_option);
    }
    div_time.append(div_time_select_hour);

    div_time_select_mins = document.createElement("select");
    div_time_select_mins.setAttribute("id","num-minutes");

    for( let i = 0; i < 12 ; i ++ )
    {
      let div_time_select_mins_option= document.createElement("option");
      div_time_select_mins_option.value = i;
      div_time_select_mins_option.innerHTML = i*5 + "  mins";
      div_time_select_mins.append(div_time_select_mins_option);
    }
    div_time.append(div_time_select_mins);
    main_form.append(div_time);
    const br11 = document.createElement('br');
    main_form.append(br11);
    const br12 = document.createElement('br');
    main_form.append(br12);

    //Elements for steps

    const steps_label = document.createElement("label");
    steps_label.innerHTML = "Steps:";

    const section_steps = document.createElement("section");
    section_steps.setAttribute("name","steps");

    const section_steps_div = document.createElement("div");
    section_steps_div.classList.add("recipe-steps");
    const section_steps_div_div = document.createElement("div");      
    const section_steps_div_div_label = document.createElement("label");
    section_steps_div_div_label.innerHTML = "1. ";
    section_steps_div_div.append(section_steps_div_div_label);
    
    const section_steps_div_div_textarea = document.createElement("textarea");
    section_steps_div_div_textarea.classList.add("steps");
    section_steps_div_div_textarea.style = "height: 70px; width: 300px; vertical-align: middle";
    section_steps_div_div_textarea.placeholder = "Add the first step of creating your recipe here! ";
    section_steps_div_div_textarea.id = "step1";

    section_steps_div_div.append(section_steps_div_div_textarea);

    section_steps_div.append(section_steps_div_div);
    section_steps.append(section_steps_div);

    const section_steps_AddButton = document.createElement("button");
    section_steps_AddButton.id = "add-step";
    section_steps_AddButton.addEventListener('click', addStep);
    section_steps_AddButton.type = "button";
    section_steps_AddButton.innerHTML = "Add Step";
    section_steps.append(section_steps_AddButton);

    const section_steps_RemoveButton = document.createElement("button");
    section_steps_RemoveButton.id = "remove-step";
    section_steps_RemoveButton.addEventListener('click', removeStep);
    section_steps_RemoveButton.type = "button";
    section_steps_RemoveButton.innerHTML = "Remove Step";
    section_steps.append(section_steps_RemoveButton);

    main_form.append(section_steps);

    const br13 = document.createElement('br');
    main_form.append(br13);
    const br14 = document.createElement('br');
    main_form.append(br14);

    //Element for uploading Image

    const file_label = document.createElement("lapbel");
    file_label.innerHTML = "Please upload your new recipe image if you would like to change";
    main_form.append(file_label);

    const file_label_input = document.createElement("input");
    file_label_input.type = "file";
    file_label_input.accept = "image/png,image/jpeg";
    file_label_input.setAttribute("id","recipe-image");
  
    main_form.append(file_label_input);
    
    const br15 = document.createElement('br');
    main_form.append(br15);
    const br16 = document.createElement('br');
    main_form.append(br16);

    const update_button = document.createElement("button");
    update_button.type = "click";
    update_button.id = "update-recipe";
    update_button.innerHTML = "Update";

    update_button.addEventListener("click",function(event){

      event.preventDefault();
      const allInputs = document.querySelectorAll('.ingredients-field input');
      const recipeInput = Array.from(allInputs);

      // Take all the inputs and make it a key value pair, scrape data
      // Then build an array of strings with the ingredients as the entries.
      const formattedIngredients = recipeInput.reduce((acc, input) =>
        ({...acc, [input.id]: input.value}), {});
      const ingredientArray = [];

      const allIPlaceholder = document.querySelectorAll('.ingredients-field placeholder');
      const recipePlaceHolder = Array.from(allIPlaceholder)
      const formattedIngredientsPlaceholder = recipeInput.reduce((acc, input) =>
        ({...acc, [input.id]: input.placeholder}), {});


      for (const currIngred in formattedIngredientsPlaceholder) {
        if (formattedIngredients[currIngred]) {
          ingredientArray.push(formattedIngredients[currIngred]);
        }
        else{

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
      //const recipeImage = document.querySelector('#recipe-image');
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
      recipe.data.description = document.querySelector('#description').value;;
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
      }
      else{
          // Upload image to server, once that process is complete (async),
          // write the object to database
          const ref = storage.ref().child(`images/${recipe.data.name}-${userID}`);
          const uploadTask = ref.put(recipeImage.files[0]);
          uploadTask.on('state_changed',
          (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
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

    main_form.append(update_button);

    const cancel_button = document.createElement("button");
    cancel_button.type = "button";
    cancel_button.id = "cancel-recipe";
    cancel_button.innerHTML = "Canel";

    main_form.append(cancel_button);
    main.append(main_form);
    bodyDiv.append(main);
    
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
    removeExpandRecipe(cancel_button,overlayDiv);

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
  document.querySelector('#description').value = searchForKey(object, 'description');
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
    }
  }
  // Getting minues
  for (let i = hour.length+1; i < time.length-1; i ++ ) {
    min += time[i];
  }

  if(min == '' && hour == '')
  {
    for(const a in time)
    {
      if(time[a] == "M")
      for( let i = 0 ; i < a; i ++ )
      {
        min += time[i];
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

  console.log(min)
  console.log(hour);
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
   * fields. You can remove any of the HTML elements added but not the first one.
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
