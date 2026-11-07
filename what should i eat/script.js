let meals = [];
let selectedCuisine = [];
let selectedEffort = "any";
let selectedBudget = "any";
let selectedDiet = "any";

// DOM elements
const cuisineButtons = document.querySelectorAll("[data-cuisine]");
const effortButtons = document.querySelectorAll("[data-effort]");
const budgetButtons = document.querySelectorAll("[data-budget]");
const dietButtons = document.querySelectorAll("[data-diet]");
const decideButton = document.querySelector("#decideButton");
const mealName = document.querySelector("#mealName");
const mealTime = document.querySelector("#mealTime");
const mealBudget = document.querySelector("#mealBudget");
const mealEffort = document.querySelector("#mealEffort");
const mealProtien = document.querySelector("#mealProtien");
const ingredientsList = document.querySelector("#ingredients");
const ingredientsTitle = document.querySelector("#result h3");

fetch("meals.json")
    .then(response => response.json())
    .then(data => {
        meals = data;

        // JSON has loaded
        decideButton.disabled = false;
    })
    .catch(error => {
        console.error(
            "Could not load meal data:",
            error
        );
    });

cuisineButtons.forEach(button => {
    button.addEventListener("click", () => {
        const cuisine = button.dataset.cuisine;

        // "Anything" clears all cuisine selections
        if (cuisine === "any" || null) {
            selectedCuisine = [];

            cuisineButtons.forEach(button => {button.classList.remove("selected");});

            button.classList.add("selected");
            return;
        }

        // Remove "Anything" if another cuisine is selected
        const anyButton = document.querySelector("[data-cuisine='any']");
        anyButton.classList.remove("selected");

        // If already selected, remove it
        if (selectedCuisine.includes(cuisine)) {
            selectedCuisine = selectedCuisine.filter(selected => selected !== cuisine);
            button.classList.remove("selected");
        }
        // If not selected, add it
        else {
            selectedCuisine.push(cuisine);
            button.classList.add("selected");
        }
    });
});

effortButtons.forEach(button => {
    button.addEventListener("click", () => {
        const effort = button.dataset.effort;

        // If clicking the active button, toggle it off back to "any"
        if (selectedEffort === effort && effort !== "any") {
            selectedEffort = "any";
            updateSelectedButton(effortButtons, null);
        } else {
            selectedEffort = effort;
            updateSelectedButton(effortButtons, button);
        }
    });
});

budgetButtons.forEach(button => {
    button.addEventListener("click", () => {
        const budget = button.dataset.budget;

        // If clicking the active button, toggle it off back to "any"
        if (selectedBudget === budget && budget !== "any") {
            selectedBudget = "any";
            updateSelectedButton(budgetButtons, null);
        } else {
            selectedBudget = budget;
            updateSelectedButton(budgetButtons, button);
        }
    });
});

// Diet buttons
dietButtons.forEach(button => {
    button.addEventListener("click", () => {
        const diet = button.dataset.diet;
        if (selectedDiet === diet && diet !== "any") {
            selectedDiet = "any";
            updateSelectedButton(dietButtons, null);
        } else {
            selectedDiet = diet;
            updateSelectedButton(dietButtons, button);
        }
    });
});

function updateSelectedButton(buttons, selectedButton) {
    buttons.forEach(button => {
        button.classList.remove("selected");
    });
    
    // Only highlight if a specific button was selected
    if (selectedButton) {
        selectedButton.classList.add("selected");
    }
}

function getMatchingMeals() {
    return meals.filter(meal => {
        const cuisineMatches = selectedCuisine.length === 0 || selectedCuisine.every(cuisine => meal.cuisine.includes(cuisine));
        const effortMatches = selectedEffort === "any" || meal.effort === selectedEffort;
        const budgetMatches = selectedBudget === "any" || meal.budget === selectedBudget;
        const dietMatches = selectedDiet === "any" || (meal.dietary_restrictions && meal.dietary_restrictions.includes(selectedDiet));
        
        return (cuisineMatches && effortMatches && budgetMatches && dietMatches);
    });
}

function chooseMeal(mealList) {
    const randomIndex =
        Math.floor(Math.random() * mealList.length);
    return mealList[randomIndex];
}

function displayMeal(meal) {
    mealName.textContent = meal.name;
    mealTime.textContent = `${meal.time} minutes`;
    mealBudget.textContent = `Price: ${meal.budget.charAt(0).toUpperCase()}${meal.budget.slice(1)}`;
    mealEffort.textContent = `Difficulty: ${meal.effort.charAt(0).toUpperCase()}${meal.effort.slice(1)}`;
    mealProtien.textContent = `Protien: ${meal.protien.charAt(0).toUpperCase()}${meal.protien.slice(1)}`;

     // Show ingredients title
    ingredientsTitle.style.display = "block";

    // Clear old ingredients
    ingredientsList.innerHTML = "";

    // Add ingredients
    meal.ingredients.forEach(ingredient => {
        const listItem = document.createElement("li");
        listItem.textContent = ingredient;
        ingredientsList.appendChild(listItem);
    });
}

decideButton.addEventListener("click", () => {
    const matchingMeals = getMatchingMeals();

    // No matching recipes
    if (matchingMeals.length === 0) {
        mealName.textContent = "No meals found!";
        mealTime.textContent = "";
        mealBudget.textContent = "";
        mealEffort.textContent = "";
        ingredientsList.innerHTML = "";
        mealProtien.textContent = "";
        ingredientsTitle.style.display = "none";
        return;
    }

    // Pick a random matching recipe
    const chosenMeal = chooseMeal(matchingMeals);
    displayMeal(chosenMeal); // Show the recipe
});