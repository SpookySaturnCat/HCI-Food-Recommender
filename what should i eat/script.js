let meals = [];
let selectedCuisine = [];
let selectedEffort = "any";
let selectedBudget = "any";
let selectedDiet = "any";

// API key for Spoonacular API pulled from config.js
const SPOONACULAR_API_KEY = typeof CONFIG !== "undefined" ? CONFIG.SPOONACULAR_API_KEY: "";

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

// Spoonacular API integration (ai assisted)
function mapSpoonacularToLocalSchema(apiRecipe) {
    const readyMinutes = apiRecipe.readyInMinutes || 30;
    let estimatedEffort = "medium";
    if (readyMinutes <= 20) estimatedEffort = "easy";
    else if (readyMinutes >= 60) estimatedEffort = "hard";

    const priceCents = apiRecipe.pricePerServing || 300;
    let estimatedBudget = "moderate";
    if (priceCents < 200) estimatedBudget = "cheap";
    else if (priceCents > 500) estimatedBudget = "expensive";

    return {
        name: apiRecipe.title,
        cuisine: apiRecipe.cuisines?.length ? apiRecipe.cuisines.map(c => c.toLowerCase()) : ["any"],
        effort: estimatedEffort,
        budget: estimatedBudget,
        protien: "varies (API)",
        dietary_restrictions: apiRecipe.diets || [],
        time: readyMinutes,
        ingredients: apiRecipe.extendedIngredients 
            ? apiRecipe.extendedIngredients.map(ing => ing.originalName || ing.name) 
            : ["See full recipe on Spoonacular"]
    };
}

async function fetchFallbackRecipe() {
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "YOUR_API_KEY_HERE") return null;

    const params = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
        number: 5,
        addRecipeInformation: true,
        fillIngredients: true
    });

    if (selectedCuisine.length > 0) params.append("cuisine", selectedCuisine.join(","));
    if (selectedDiet !== "any") {
        if (selectedDiet === "soy-free") params.append("intolerances", "soy");
        else params.append("diet", selectedDiet);
    }
    if (selectedEffort === "easy") params.append("maxReadyTime", "25");

    try {
        const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (!data.results || data.results.length === 0) return null;

        const randomHit = chooseMeal(data.results);
        return mapSpoonacularToLocalSchema(randomHit);
    } catch (err) {
        console.error("Spoonacular fallback failed:", err);
        return null;
    }
}

// Async Decide Button Listener
decideButton.addEventListener("click", async() => {
    const matchingMeals = getMatchingMeals();

    // No matching recipes
    if (matchingMeals.length === 0) {
        mealName.textContent = "Searching external recipes...";
        mealTime.textContent = "";
        mealBudget.textContent = "";
        mealEffort.textContent = "";
        ingredientsList.innerHTML = "";
        mealProtien.textContent = "";
        ingredientsTitle.style.display = "none";

        const apiMeal = await fetchFallbackRecipe();

        if(!apiMeal) {
            mealName.textContent = "No matching recipes found.";
            return;
        }

        displayMeal(apiMeal);
        return;
    }   

    // Pick a random matching recipe
    const chosenMeal = chooseMeal(matchingMeals);
    displayMeal(chosenMeal); // Show the recipe
});