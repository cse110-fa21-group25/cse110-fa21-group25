# Recipe Exporing

* Status: rejected
* Deciders: Ruby, Jenny, Jerry, Reyner
* Date: 2021-11-06

## Context and Problem Statement

Should we include recipe exporting in our application? Namely, should our app include the functionality to use our representation of recipes (including ingredients, instructions, etc.) and post a universal format externally?

## Decision Drivers

* Being able to export recipes means that we will need to be able to convert our recipe formats, then find a way to deliver them externally (via email, html, etc.). This presents the need for a new set of interfaces for exporting recipes.
* Target audience consideration: Since we intend to serve our application to novice cooks, it does not seem suitable that they should need to share recipes; rather, we are aiming to provide aid for the specific recipes that the user selects.

## Considered Options

* Do not include recipe exporting functionality.
* Include recipe exporting functionality.

## Decision Outcome

Chosen option: "Do not include", because this meets the decision drivers regarding developer effort as well as target audience consideration.

## Reasons for Choosing Option 1

* Cutting a potentially unnecessary feature, reducing developer load.
* Reduce complexity of user options.

## Pros and Cons of the Selected Option
**Pros:** Simplifies menu options for the user, reduces workload for backend.

**Cons:** Potentially losing out on users who want to be able to share recipes with one another.

