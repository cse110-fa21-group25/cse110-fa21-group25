# Recipe Tagging

* Status: proposed 
* Date: 2021-11-06

## Context and Problem Statement

We want recipes to have tags that can be used for filtering recipes, so that users can easily filter recipes based on tag(s).

## Considered Options

* At least one tag required for each recipe
* Tags optional for each recipe

## Decision Outcome

Chosen option: Option 1 

## Reasons for Choosing Option 1 

* Filtering by tag is a feature that we want to implement, so if a recipe does not have a tag, that recipe would never show up when filtering by tag.
* Allowing the user to filter by tag makes it easier to find whatever recipe they are looking for.

## Pros and Cons of Option 1 

**Pros:** Allows an easy way to associate a recipe and who has permision to create/modify/recipes. Allows us also to give credit to however is creating a recipe and see recipes associated with a user's account.

**Cons:** We now have to work on back end design that will safely store user data. Further decisions may be necessary on how this is done.

## Pros and Cons of Option 2

**Pros:** Allows an easy way to associate a recipe and who has permision to create/modify/recipes. Allows us also to give credit to however is creating a recipe and see recipes associated with a user's account.

**Cons:** We now have to work on back end design that will safely store user data. Further decisions may be necessary on how this is done.
