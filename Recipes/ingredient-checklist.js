const ingredientStorageKey = `recipe-ingredients:${location.pathname}`;
let savedIngredientChecks = [];

try {
	savedIngredientChecks = JSON.parse(localStorage.getItem(ingredientStorageKey) || "[]");
} catch {
	localStorage.removeItem(ingredientStorageKey);
}

const ingredientItems = document.querySelectorAll('[aria-labelledby="ingredients-heading"] li');

ingredientItems.forEach((item, index) => {
	const label = document.createElement("label");
	const checkbox = document.createElement("input");
	const text = document.createElement("span");

	checkbox.type = "checkbox";
	checkbox.checked = savedIngredientChecks.includes(index);
	text.append(...item.childNodes);
	label.className = `ingredient-check${checkbox.checked ? " checked" : ""}`;
	label.append(checkbox, text);
	item.append(label);

	checkbox.addEventListener("change", () => {
		label.classList.toggle("checked", checkbox.checked);
		const checked = [...document.querySelectorAll('[aria-labelledby="ingredients-heading"] input')]
			.map((input, itemIndex) => input.checked ? itemIndex : -1)
			.filter(itemIndex => itemIndex >= 0);
		localStorage.setItem(ingredientStorageKey, JSON.stringify(checked));
	});
});