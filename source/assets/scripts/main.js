// get recipes
const recipesJSON = [
    'https://introweb.tech/assets/json/ghostCookies.json',
    'https://introweb.tech/assets/json/birthdayCake.json',
    'https://introweb.tech/assets/json/chocolateChip.json'
];

const recipeData = {}

window.addEventListener('DOMContentLoaded', init);

async function init(){
    try{
        await fetchRecipes();
    }
    catch (e){
        throw(e);
    }

    console.log(Object.keys(recipeData).length);
    createRecipeCard();
}

async function fetchRecipes(){
    return new Promise((resolve, reject)=>{
        recipesJSON.forEach(recipe => {
            fetch(recipe)
            .then(response => response.json())
            .then(data => {
                recipeData[recipe] = data;
                if(Object.keys(recipeData).length == recipesJSON.length){
                    resolve();
                }
            })
            .catch(e=>{
                console.error(e);
                reject(e);
            });
        });
    });
}

// TODO: SPLIT BASED ON HOME-PAGE CATEGORIES
// (CLARIFY CATEGORIES (e.g. trending recipes, etc.))
async function createRecipeCard(){
    for(const recipe in recipeData){
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
        thumbnailImg.setAttribute('src', getImage(recipeData[recipe]));

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');

        const recipeTitleH4 = document.createElement('h4');
        recipeTitleH4.innerHTML = getTitle(recipeData[recipe]);

        const timeP = document.createElement('p');
        timeP.innerHTML = formatTime( getTime(recipeData[recipe]) );

        const recipeOwnerP = document.createElement('p');
        // TODO: helper function for getRecipeOwner
        const getRecipeOwner = 'Gordon Ramsay 2.0';
        recipeOwnerP.innerHTML = 'By ' + getRecipeOwner.italics();

        // for actual recipes from our app, use loop to check for all tags
        const tagDiv = document.createElement('div');
        tagDiv.classList.add('tags');
        const tag1Button = document.createElement('button');
        const tag2Button = document.createElement('button');
        // TODO: helper function for getTag
        tag1Button.innerHTML = '#tag1';
        tag2Button.innerHTML = '#tag2';

        
        
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

        tagDiv.appendChild(tag1Button);
        tagDiv.appendChild(tag2Button);

        // Attach to the appropriate recipe-row category
        const exampleRecipeRow = document.querySelector('#example-recipe > .recipe-row');
        console.log(cardDiv);
        exampleRecipeRow.appendChild(cardDiv);
    }
    console.log('done looping through recipes');
}

/**
 * Get image from recipe's JSON object
 * @param {Object} data: JSON Object
 * @returns {String} recipe's image URL if exists, else null
 **/
function getImage(data) {
    if (data.image?.url) return data.image.url;
    if (data.image?.contentUrl) return data.image.contentUrl;
    if (data.image?.thumbnail) return data.image.thumbnail;
    if (data['@graph']) {
        for (let i = 0; i < data['@graph'].length; i++) {
            if (data['@graph'][i]['@type'] == 'ImageObject') {
            if (data['@graph'][i]['url']) return data['@graph'][i]['url'];
            if (data['@graph'][i]['contentUrl']) return data['@graph'][i]['contentUrl'];
            if (data['@graph'][i]['thumbnailUrl']) return data['@graph'][i]['thumbnailUrl'];
            };
        }
    }
    return null;
}

/**
 * Get title from recipe's JSON object
 * @param {Object} data: JSON Object
 * @returns {String} recipe's title if exists, else null
 **/
function getTitle(data) {
    if (data.name) return data.name;
    if (data['@graph']) {
        for (let i = 0; i < data['@graph'].length; i++) {
            if (data['@graph'][i]['@type'] == 'Recipe') {
            if (data['@graph'][i]['name']) return data['@graph'][i]['name'];
            };
        }
    }
    return null;
}

/**
 * Get total time from recipe's JSON object
 * @param {Object} data: JSON Object
 * @returns {String} recipe's total time to cook/prep
 **/
function getTime(data){
    let time;
    Object.keys(data).some(key=>{
        if(key == 'totalTime'){
            time = data[key];
            return true;
        }
        // recurse on data to get time
        if(data[key] && typeof data[key] == 'object'){
            time = getTime(data[key]);
            return time !== undefined;
        }
    });
    return time;
}

/**
 * Get total time from recipe's JSON object
 * @param {String} time: time as String
 * @returns {String} reformatted time as String
 **/
function formatTime(time){
    time = time.slice(2);
    let timeFormat = time.split('');
    let unit = timeFormat.pop();
    if(unit == 'H'){
        unit = 'hr';
    }
    if(unit == 'M'){
        unit = 'min';
    }
    if(parseInt(timeFormat[0]) > 1){
        unit += 's';
    }
    const editedUnit = ' '+unit;
    timeFormat.push(editedUnit);
    return timeFormat.join('');
}


// TODO: GET RECIPE'S OWNER FUNCTION
