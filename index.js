const searchForm = document.querySelector("#searchForm");
const mealsContainer = document.querySelector("#meals-container");
const errorMsg = document.querySelector("#errMsg");
const loader = document.querySelector(".loader");
const recipeModalContainer = document.querySelector("#recipe-modal");
let renderData = "";
let renderModalData = "";

searchForm.addEventListener("submit", handleSearch);

async function handleSearch(e) {
  e.preventDefault();
  const searchInput = e.target[0].value;

  if (!searchInput) return;

  loader.classList.remove("hidden");

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`
  );
  const { meals } = await res.json();

  if (meals?.length > 0) {
    meals.map((meal) => {
      return renderMealsData(meal);
    });

    mealsContainer.innerHTML = renderData;

    document.querySelectorAll(".modal-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mealId = btn.getAttribute("data-id");
        const mealData = meals.find((meal) => meal.idMeal === mealId);
        console.log(mealData, "mealDAta");

        if (mealData) recipeModal(mealData);
      });
    });

    errorMsg.classList.add("hidden");
  } else {
    mealsContainer.innerHTML = "";
    errorMsg.classList.remove("hidden");
  }
  loader.classList.add("hidden");

  searchForm.reset();
}

function renderMealsData(meal) {
  renderData += `
    <div
            class="card border h-64 rounded-lg shadow-lg shadow-gray-800 bg-gray-800 p-2 relative flex items-center justify-end flex-col"
            style="
              background: url('${meal?.strMealThumb}');
              background-position: center center;
              background-size: cover;
              opacity: 0.85;
            "
          >
            <div class="bg-gray-900/80 w-full rounded-lg px-3 py-2">
              <h3 class="font-bold mb-1.5">${meal?.strMeal} &CenterDot; ${meal?.strArea}</h3>
              <div class="flex gap-3 items-center mb-4">
                <div class="text-sm ${
                  meal?.strCategory === "Vegetarian"
                    ? "text-green-500"
                    : meal?.strCategory === "Dessert" ? "text-green-500" :  "text-red-500"
                }">${meal?.strCategory}</div>
                <div class="flex gap-2 overflow-x-scroll py-1 px-2 transition hide-scrollbar">${
                  meal?.strTags
                    ? meal.strTags
                        ?.toString()
                        .split(",")
                        .map(
                          (tag) =>
                            `<span class="text-xs ring-2 ring-rose-600 py-0.5 px-1 rounded-full">${tag}</span>`
                        ).slice(0,3)
                        .join(" ")
                    : ""
                }</div>
              </div>
              <div class="text-center">

                  <button class="text-xs modal-btn font-semibold border py-1 px-3 hover:bg-gray-100 hover:text-black rounded-lg cursor-pointer" data-id="${
                    meal?.idMeal
                  }" onclick="recipeModal()">
                    View
                  </button>
              </div>
            </div>
          </div>`;
}

function recipeModal(meal) {

  const ingredients = [];

  for(let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if(ingredient) {
      ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
    }
  }

  renderModalData = `<!-- Modal container -->
          <div class="bg-gray-800 rounded-lg shadow-lg w-full max-w-md relative h-3/4 overflow-y-scroll" style="
              background: url('${meal?.strMealThumb}');
              background-position: center center;
              background-size: cover;
            ">
            <!-- Close button -->
            <button
              class="absolute cursor-pointer top-3 right-3 text-gray-200 hover:text-red-600 rounded-full p-2 transition"
              onclick="document.getElementById('recipe-modal').classList.add('hidden')"
              aria-label="Close"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Modal content: Recipe details only -->
            <div class="p-6 space-y-3 bg-gray-800/60" >
              <h2 class="text-2xl font-bold text-white">${meal?.strMeal}</h2>
              <div class="flex gap-3 items-center mb-4">
                <h3 class="bg-gray-800/90 py-1 px-2 rounded-lg text-sm ${meal?.strCategory === "Vegetarian" ? "text-green-500" : meal?.strCategory === "Dessert" ? "text-green-500" :  "text-red-500"}">${meal?.strCategory}</h3>
                ${meal?.strArea ? `&CenterDot; <h3 class=" bg-gray-800/90 py-1 px-2 rounded-lg text-sm">${meal.strArea}</h3>` : ""}
                </div>
                <div class="flex gap-2">${
                  meal?.strTags
                    ? meal.strTags
                        ?.toString()
                        .split(",")
                        .map(
                          (tag) =>
                            `<span class="text-xs ring-2 ring-orange-600 hover:bg-orange-600 py-0.5 px-1 rounded-full">${tag}</span>`
                        )
                        .join(" ")
                    : ""
                }</div>
              <div>
                <h3 class="font-semibold mb-1">Ingredients:</h3>
                <ul class="list-disc list-inside text-gray-200 space-y-1">
                  ${ingredients.map(ingr => (
                    `<li>${ingr}</li>`
                  )).join(" ")}
                </ul>
              </div>
              <div>
                <h3 class="font-semibold mb-1">Instructions:</h3>
                <p>${meal?.strInstructions}</p>
              </div>
            </div>
          </div>`;

    recipeModalContainer.classList.remove("hidden");
    recipeModalContainer.innerHTML = renderModalData;
}
