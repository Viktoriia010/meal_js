const cl = console.log;

const form = document.getElementById("food-search") as HTMLFormElement;
const input = document.getElementById("food-input") as HTMLInputElement;

const URL_MEAL = `https://www.themealdb.com/api/json/v1/1/`;

const container = document.getElementById("meals-container") as HTMLDivElement;
const popularContainer = document.getElementById("popular") as HTMLDivElement;
const categoryMeals = document.getElementById(
  "category-meals",
) as HTMLDivElement;

getRandomMeal(popularContainer);
getRandomMeal(popularContainer);
getRandomMeal(popularContainer);

async function getMealByID(id: number) {
  const respons = await fetch(`${URL_MEAL}lookup.php?i=${id}`);
  const data = await respons.json();
  return data.meals[0];
}

async function getMealsByCategory(category: string) {
  if (!category) return;
  const respons = await fetch(`${URL_MEAL}filter.php?c=${category}`);
  const data = await respons.json();
  const arr = data.meals;
  for (let i = 0; i < arr.length; i++) {
    const el = await getMealByID(arr[i].idMeal);
    renderMeal(el, categoryMeals);
  }
}

async function getMeal(meal: string) {
  if (!meal) return;
  const respons = await fetch(`${URL_MEAL}search.php?s=${meal}`);
  const data = await respons.json();
  const arr = data.meals;
  for (let i = 0; i < arr.length; i++) {
    renderMeal(arr[i], container);
  }
}

function renderMeal(meal: any, container: HTMLElement) {
  const card = document.createElement("div");
  card.className = "col-md-4";

  card.innerHTML = `
  
    <div class="card h-100 shadow-sm d-flex flex-column">
      <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}" />

      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${meal.strMeal}</h5>

           <p class="card-text">
          ${meal.strCategory} • ${meal.strArea !== null ? meal.strArea : ""}
        </p>

        <button class="btn btn-primary  mt-auto" data-bs-toggle="modal" data-bs-target="#mealModal">
          Детальніше
        </button>
      </div>
    </div>
  `;

  const button = card.querySelector("button")!;
  button.addEventListener("click", () => openModal(meal));
  if (container) {
    container.appendChild(card);
  } else {
    cl("Контейнер не знайдено");
  }
}

async function getRandomMeal(container: HTMLElement) {
  const respons = await fetch(`${URL_MEAL}random.php`);
  const data = await respons.json();
  const element = data.meals[0];
  const card = document.createElement("div");
  card.className = "col-md-4";

  card.innerHTML = `
    <div class="card h-100 shadow-sm d-flex flex-column">
      <img src="${element.strMealThumb}" class="card-img-top" />

      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${element.strMeal}</h5>

        <p class="card-text">
          ${element.strCategory} • ${element.strArea !== null ? element.strArea : ""}
        </p>

        <button class="btn btn-primary mt-auto" data-bs-toggle="modal" data-bs-target="#mealModal">
          Детальніше
        </button>
      </div>
    </div>
  `;
  const button = card.querySelector("button")!;
  button.addEventListener("click", () => openModal(element));
  container.appendChild(card);
}

function openModal(meal: any) {
  const modalTitle = document.querySelector(".modal-title") as HTMLElement;
  const modalBody = document.querySelector(".modal-body") as HTMLElement;

  modalTitle.textContent = meal.strMeal;

  modalBody.innerHTML = `
    <img src="${meal.strMealThumb}" class="img-fluid rounded mb-3" />

    <p><strong>Категорія:</strong> ${meal.strCategory}</p>
    <p><strong>Країна:</strong> ${meal.strArea !== null ? meal.strArea : ""}</p>

    <h4>Інгредієнти</h4>
    <ul>
      ${getIngredients(meal)}
    </ul>

    <h4 class="mt-3">Інструкція</h4>
    <p>${meal.strInstructions}</p>

    ${
      meal.strYoutube
        ? `<a href="${meal.strYoutube}" target="_blank" class="btn btn-danger mt-3">
            YouTube відео
          </a>`
        : ""
    }
  `;
}

function getIngredients(meal: any): string {
  let list = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      list += `<li>${ingredient} - ${measure}</li>`;
    }
  }

  return list;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = input.value.trim();
  console.log(value);

  container.innerHTML = "";
  getMeal(value);
});

const rand = document.getElementById("rand") as HTMLImageElement;
rand.addEventListener("click", () => {
  getRandomMeal(container);
  container.innerHTML = "";
});

const caregories = document.querySelectorAll(".category")!;

caregories.forEach((element) => {
  element.addEventListener("click", () => {
    categoryMeals.innerHTML = "";
    getMealsByCategory(element.textContent.trim());
  });
});
