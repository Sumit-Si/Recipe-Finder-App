const searchForm = document.querySelector("#searchForm");
const mealsContainer = document.querySelector("#meals-container");
const errorMsg = document.querySelector("#errMsg");
const loader = document.querySelector(".loader");
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
  console.log(meals, "data");

  if (meals?.length > 0) {
    meals.map((meal) => {
      return renderMealsData(meal);
    });

    mealsContainer.innerHTML = renderData;
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
              background: url('${meal.strMealThumb}');
              background-position: center center;
              background-size: cover;
              opacity: 0.85;
            "
          >
            <div class="bg-gray-900/80 w-full rounded-lg px-3 py-2">
              <h3 class="font-bold mb-1.5">${meal.strMeal}</h3>
              <div class="flex gap-3 items-center mb-4">
                <div class="text-sm ${
                  meal.strCategory === "Vegetarian"
                    ? "text-green-500"
                    : "text-red-500"
                }">${meal.strCategory}</div>
                <div class="flex gap-2">${
                  meal?.strTags
                    ? meal.strTags
                        ?.toString()
                        .split(",")
                        .map(
                          (tag) =>
                            `<span class="text-xs ring-2 ring-rose-600 py-0.5 px-1 rounded-full">${tag}</span>`
                        )
                        .join(" ")
                    : ""
                }</div>
              </div>
              <div class="text-center">

                  <button class="text-xs font-semibold border py-1 px-3 hover:bg-gray-100 hover:text-black rounded-lg cursor-pointer" id="view" onclick="recipeModal()">
                    View
                  </button>
              </div>
            </div>
          </div>`;
}

function recipeModal(id) {
  console.log("clicked",id);
  
  renderModalData = `<!-- Modal container -->
          <div class="bg-gray-800 rounded-lg shadow-lg w-full max-w-md relative">
            <!-- Close button -->
            <button
              class="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-red-600 rounded-full p-2 transition"
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
            <div class="p-6 space-y-3">
              <h2 class="text-2xl font-bold text-green-700">Classic Pasta</h2>
              <div>
                <h3 class="font-semibold mb-1">Ingredients:</h3>
                <ul class="list-disc list-inside text-gray-400 space-y-1">
                  <li>200g spaghetti</li>
                  <li>2 tbsp olive oil</li>
                  <li>2 cloves garlic, minced</li>
                  <li>Salt and pepper to taste</li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold mb-1">Instructions:</h3>
                <ol class="list-decimal list-inside text-gray-400 space-y-1">
                  <li>Boil spaghetti according to package instructions.</li>
                  <li>Heat olive oil and sauté garlic until fragrant.</li>
                  <li>
                    Toss spaghetti in the pan, season with salt and pepper.
                  </li>
                  <li>Serve hot and enjoy!</li>
                </ol>
              </div>
            </div>
          </div>`;
}
