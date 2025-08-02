const searchForm = document.querySelector("#searchForm");
const mealsContainer = document.querySelector("#meals-container");
let renderData = "";

searchForm.addEventListener("submit", handleSearch);

async function handleSearch(e) {
  e.preventDefault();
  const searchInput = e.target[0].value;

  if (!searchInput) return;

  console.log(e.target, "clicked");

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`
  );
  const { meals } = await res.json();
  console.log(meals, "data");

  if(meals.length > 0) {
    meals.map(meal => {
        return renderMealsData(meal)
    })
  }

  mealsContainer.innerHTML = renderData;
}

function renderMealsData(meal) {
  renderData += `
    <div
            class="card border h-52 rounded-lg shadow-lg shadow-gray-800 bg-gray-800 p-2 relative flex items-center justify-end flex-col"
            style="
              background: url('${meal.strMealThumb}');
              background-position: center center;
              background-size: cover;
              opacity: 0.85;
            "
          >
            <div class="bg-gray-900/80 w-full rounded-lg px-3 py-2">
              <h3 class="font-bold mb-1">${meal.strMeal}</h3>
              <div class="flex gap-3 items-center mb-4">
                <div class="text-sm ${meal.strCategory === "Vegetarian" ? "text-green-500" : "text-red-500"}">${meal.strCategory}</div>
                <div class="flex gap-2">${(meal?.strTags)?.toString().split(",").map(tag => (
                    `<span class="text-xs ring-2 ring-rose-600 py-0.5 px-3 rounded-full">${tag}</span>`
                )).join(" ")}</div>
              </div>
              <div class="text-center">

                  <button class="text-xs font-semibold border py-1 px-3 hover:bg-gray-100 hover:text-black rounded-lg cursor-pointer" id="view">
                    View
                  </button>
              </div>
            </div>
          </div>`;
}
