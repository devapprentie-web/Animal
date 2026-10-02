/* =========================
app.js
========================= */

const searchForm = document.getElementById("searchForm");
const animalInput = document.getElementById("animalInput");

const animalCard = document.getElementById("animalCard");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");

const animalImage = document.getElementById("animalImage");
const animalName = document.getElementById("animalName");
const scientificName = document.getElementById("scientificName");
const animalDescription = document.getElementById("animalDescription");

const habitat = document.getElementById("habitat");
const food = document.getElementById("food");
const type = document.getElementById("type");
const classification = document.getElementById("classification");

const funFact = document.getElementById("funFact");
const wikiLink = document.getElementById("wikiLink");
const favoriteBtn = document.getElementById("favoriteBtn");

let currentAnimal = null;

/* =========================
RECHERCHE
========================= */

searchForm.addEventListener("submit", function (event) {
event.preventDefault();

const animal = animalInput.value.trim();

if (!animal) {
    animalInput.focus();
    return;
}

searchAnimal(animal);

});

/* =========================
RECHERCHE ANIMAL
========================= */

async function searchAnimal(animal) {

hideAll();

loading.classList.remove("hidden");

try {

    const url =
        "https://fr.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(animal);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Animal introuvable");
    }

    const data = await response.json();

    if (
        !data ||
        data.type === "disambiguation" ||
        !data.extract
    ) {
        throw new Error("Animal introuvable");
    }

    displayAnimal(data);

} catch (error) {

    console.error(error);

    loading.classList.add("hidden");
    errorBox.classList.remove("hidden");

}

}

/* =========================
AFFICHAGE
========================= */

function displayAnimal(data) {

loading.classList.add("hidden");
errorBox.classList.add("hidden");
animalCard.classList.remove("hidden");

const title = data.title || "Animal";

const description =
    data.extract ||
    "Aucune description disponible.";

const image =
    data.thumbnail?.source ||
    "https://via.placeholder.com/800x600?text=Animal";

animalImage.src = image;
animalImage.alt = title;

animalName.textContent = title;

animalDescription.textContent = description;

scientificName.textContent =
    data.description || "Espèce animale";

habitat.textContent = detectHabitat(title);
food.textContent = detectFood(title);

type.textContent = detectType(title);

classification.textContent =
    data.description || "Animal";

funFact.textContent =
    createFunFact(title);

wikiLink.href =
    data.content_urls?.desktop?.page ||
    `https://fr.wikipedia.org/wiki/${encodeURIComponent(title)}`;

currentAnimal = {
    name: title,
    image: image,
    description: description,
    link: wikiLink.href
};

updateFavoriteButton();

document.getElementById("decouvrir")
    .scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

/* =========================
DONNÉES SIMPLES
========================= */

function detectHabitat(name) {

const animal = name.toLowerCase();

if (
    animal.includes("lion") ||
    animal.includes("éléphant") ||
    animal.includes("girafe") ||
    animal.includes("zèbre")
) {
    return "Afrique";
}

if (
    animal.includes("panda")
) {
    return "Forêts de Chine";
}

if (
    animal.includes("ours polaire")
) {
    return "Arctique";
}

if (
    animal.includes("dauphin") ||
    animal.includes("baleine") ||
    animal.includes("requin")
) {
    return "Océans";
}

return "Variable";

}

function detectFood(name) {

const animal = name.toLowerCase();

if (
    animal.includes("lion") ||
    animal.includes("tigre") ||
    animal.includes("requin")
) {
    return "Carnivore";
}

if (
    animal.includes("panda") ||
    animal.includes("vache") ||
    animal.includes("girafe")
) {
    return "Herbivore";
}

return "Variable";

}

function detectType(name) {

const animal = name.toLowerCase();

if (
    animal.includes("requin") ||
    animal.includes("dauphin") ||
    animal.includes("baleine")
) {
    return "Animal marin";
}

if (
    animal.includes("serpent") ||
    animal.includes("crocodile") ||
    animal.includes("tortue")
) {
    return "Reptile";
}

if (
    animal.includes("aigle") ||
    animal.includes("perroquet") ||
    animal.includes("hibou")
) {
    return "Oiseau";
}

return "Mammifère";

}

function createFunFact(name) {

const animal = name.toLowerCase();

if (animal.includes("éléphant")) {
    return "Les éléphants utilisent leur trompe pour respirer, boire, saisir des objets et communiquer.";
}

if (animal.includes("lion")) {
    return "Les lions vivent généralement en groupes sociaux appelés des troupes.";
}

if (animal.includes("panda")) {
    return "Le panda géant passe une grande partie de sa journée à manger du bambou.";
}

if (animal.includes("dauphin")) {
    return "Les dauphins utilisent des sons et l'écholocalisation pour communiquer et se repérer.";
}

if (animal.includes("girafe")) {
    return "La girafe possède un très long cou qui lui permet d'atteindre les feuilles situées en hauteur.";
}

return `Le ${name} possède des caractéristiques uniques qui le rendent fascinant à découvrir.`;

}

/* =========================
SUGGESTIONS
========================= */

document.querySelectorAll(".suggestion").forEach(button => {

button.addEventListener("click", function () {

    const animal = this.textContent.trim();

    animalInput.value = animal;

    searchAnimal(animal);

});

});

/* =========================
ANIMAUX POPULAIRES
========================= */

document.querySelectorAll(".popular-card").forEach(card => {

card.addEventListener("click", function () {

    const animal = this.dataset.animal;

    animalInput.value = animal;

    searchAnimal(animal);

});

});

/* =========================
FAVORIS
========================= */

favoriteBtn.addEventListener("click", function () {

if (!currentAnimal) {
    return;
}

let favorites =
    JSON.parse(localStorage.getItem("animalia_favorites")) || [];

const alreadyExists =
    favorites.some(item => item.name === currentAnimal.name);

if (alreadyExists) {

    favorites = favorites.filter(
        item => item.name !== currentAnimal.name
    );

    localStorage.setItem(
        "animalia_favorites",
        JSON.stringify(favorites)
    );

    updateFavoriteButton();

    return;
}

favorites.push(currentAnimal);

localStorage.setItem(
    "animalia_favorites",
    JSON.stringify(favorites)
);

updateFavoriteButton();

});

function updateFavoriteButton() {

if (!currentAnimal) {
    return;
}

const favorites =
    JSON.parse(localStorage.getItem("animalia_favorites")) || [];

const exists =
    favorites.some(
        item => item.name === currentAnimal.name
    );

if (exists) {
    favoriteBtn.textContent =
        "❤️ Retirer des favoris";
} else {
    favoriteBtn.textContent =
        "🤍 Ajouter aux favoris";
}

}

/* =========================
UTILITAIRE
========================= */

function hideAll() {

animalCard.classList.add("hidden");
errorBox.classList.add("hidden");
loading.classList.add("hidden");


}

/* =========================
app.js
========================= */
