# Recipe Sorting
* Status: Accepted
* Date: 2021-12-06

## Context and Problem Statement

For our project, we want to have a sorting features for the recipes we have on our app.


## Considered Options

* Most recent published recipes
* Alphabetical order of recipe's title
* Tags (Based on our tagging feature)
* Duration to cook the recipe
* Cumulative rating of a recipe

## Decision Outcome

The decision that we ultimately came to was a result of time-constraints was to only include the searching by tags feature. In the search bar you can type in the name of a tag and all the recipes with that tag will show up. Alternatively if you click on the tag it will start searching for all recipes that have that tag. The tags you are filtering by pop up in a little overlay under the navbar. You can add tags and remove them as necessary to narrow your search results.

## Reasons for Choosing Options
* Having a large number of recipes can be overwhelming to search through, especially if you are just browsing and don't excatly know what you want yet.
* There should be an easy and intuitive way to narrow down your search categories. 
* The tags feature was a adr that we decided on at the beginning, so searching/sorting by tags was our implementation of choice
