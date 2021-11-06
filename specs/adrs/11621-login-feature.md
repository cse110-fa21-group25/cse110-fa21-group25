# {Login Feature}

* Status: {accepted}
* Deciders: {Dorsa, Quoc, Ruby, Ting-Yun, Jerry, Justin, Reyner, Yoomin, Jenny} <!-- optional -->
* Date: {2021-11-6} 


## Context and Problem Statement

{We need to decide how recipe management works. Proposed solution was to make a login feature that would tie recipe management to a personal user account}

## Considered Options

* {No login feature - anyone can create/update/delete recipes. This is rejected for obvious reasons}
* {Browse recipes without needing to make an account, but creating a recipe must be tied to an account so only the owner of that recipe can update/delete that recipe at a later date}


## Decision Outcome

Chosen option: Option 2

## Reasons for Choosing Option 2
* There needs to be a way to avoid 'griefing' where other people edit your recipes. 
* Wikipedia is a succesful example of option 1 where for the most part the information on wikipedia is reliable. However it still gets a bad rap since some people don't consider it a reputable source. We are also not looking to create this type of recipe management app since the probability of user 'griefing' seems to be quite high.
* Tying in recipe creation to a user account allows us to easily see who has permission to update and delete recipes. 
* Many other recipe management apps follow similar approaches.

## Pros and Cons of the selected Option.
**Pros:** Allows an easy way to associate a recipe and who has permision to create/modify/recipes. Allows us also to give credit to however is creating a recipe and see recipes associated with a user's account.

**Cons:** We now have to work on back end design that will safely store user data. Further decisions may be necessary on how this is done.
