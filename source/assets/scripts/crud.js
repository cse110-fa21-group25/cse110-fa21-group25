const db = firebase.firestore();

/**
 * CREATE/UPDATE/DELETE: only works when user is logged in
 * GET: works regardless of authentication
 */

/**
 * function retrieves all of the existing recipes
 * @returns a promise for all of the recipe
 */
function getAllRecipes() {
  return db.collection("recipes").get().then((querySnapshot) => {
      const results = []
      querySnapshot.forEach((doc) => {
          results.push({id: doc.id, data: doc.data()})
      });
      return results;
  });
}

/**
 * function takes in a recipe ID and searches the database for an existing recipe
 * @param recipeID the document id
 * @returns a promise for the specific recipe
 */
function getRecipeById(recipeId) {
  return db.collection("recipes").doc(recipeId).get().then((querySnapshot) => {
      return{id: querySnapshot.id, data: querySnapshot.data()} ;
  });
}

/**
 * Function
 * @param title name of recipe
 * @returns a promise for all the recipes containing the given title
 */
function getRecipesByTitle(title) {
  return db.collection("recipes").get().then((querySnapshot) => {
      const results = []
      querySnapshot.forEach((doc) => {
        const resultTitle = doc.data().title;
        if (resultTitle.toLowerCase().includes(title.toLowerCase()))
          results.push({id: doc.id, data: doc.data()})
      });
      return results
  });
}

/**
 * Function
 * @param tag tags associated with recipe
 * @returns a promise for all the recipes containing tags
 */
function getRecipesByTag(tag) {
  return db.collection("recipes").where("tags", "array-contains", tag).get().then((querySnapshot) => {
      const results = []
      querySnapshot.forEach((doc) => {
          results.push({id: doc.id, data: doc.data()})
      });
      return results
  });
}

/**
 * Function
 * @param recipeData the recipe document
 * @returns a promise for the creation of the given recipe 
 */
function createRecipe(recipeData) {
  return db.collection("recipes").doc().set(recipeData)
  .then(() => {
      return console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error creating document: ", error);
  });
}

/**
 * function takes in a recipe object and 
 * @param recipe object include both id & data (document id & document)
 * @returns a promise for the modification of the given recipe 
 */
function updateRecipe(recipe) {
   return db.collection("recipes").doc(recipe.id).set(recipe.data).then(() => {
      return console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error updating document: ", error);
  });
}

/**
 * function takes in a recipe ID and searches the database for an existing recipe
 * and deletes it from the database
 * @param recipeId the document id
 * @returns a promise for the deletion of the given recipe 
 */
function deleteRecipeById(recipeId) {
  return db.collection("recipes").doc(recipeId).delete().then(() => {
      return console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error deleting recipe: ", error);
  });
}

