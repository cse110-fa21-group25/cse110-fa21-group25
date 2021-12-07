# Recipe Tagging

* Status: accepted
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

**Pros:** Allows an easy way to filter recipes by tag.

**Cons:** Each recipe will be required to have a tag. Users will have to choose a tag from a list of preset tags whenever creating or editing a recipe.

## Pros and Cons of Option 2

**Pros:** User does not have to choose a tag whenever creating or editing a recipe.

**Cons:** When filtering by tag, recipes that do not have a tag will be left out.
