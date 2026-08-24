function addChecklist(selector, storageKey, className) {
	let savedChecks = [];

	try {
		savedChecks = JSON.parse(localStorage.getItem(storageKey) || "[]");
	} catch {
		localStorage.removeItem(storageKey);
	}

	const items = document.querySelectorAll(selector);

	items.forEach((item, index) => {
		const label = document.createElement("label");
		const checkbox = document.createElement("input");
		const text = document.createElement("span");

		checkbox.type = "checkbox";
		checkbox.checked = savedChecks.includes(index);
		text.append(...item.childNodes);
		label.className = `${className}${checkbox.checked ? " checked" : ""}`;
		label.append(checkbox, text);
		item.append(label);

		checkbox.addEventListener("change", () => {
			label.classList.toggle("checked", checkbox.checked);
			const checked = [...document.querySelectorAll(`${selector} input`)]
				.map((input, itemIndex) => input.checked ? itemIndex : -1)
				.filter(itemIndex => itemIndex >= 0);
			localStorage.setItem(storageKey, JSON.stringify(checked));
		});
	});
}

function addStepChecklist(selector, storageKey) {
	let savedChecks = [];

	try {
		savedChecks = JSON.parse(localStorage.getItem(storageKey) || "[]");
	} catch {
		localStorage.removeItem(storageKey);
	}

	const items = document.querySelectorAll(selector);
	const progress = document.createElement("p");

	progress.className = "method-progress";
	progress.setAttribute("aria-live", "polite");

	function updateProgress() {
		const completed = [...items].filter(item => item.classList.contains("step-complete")).length;
		progress.textContent = `${completed}/${items.length} complete`;
	}

	items.forEach((item, index) => {
		const text = document.createElement("span");
		text.append(...item.childNodes);
		text.className = `step-check${savedChecks.includes(index) ? " checked" : ""}`;
		item.classList.toggle("step-complete", savedChecks.includes(index));
		text.tabIndex = 0;
		text.setAttribute("role", "checkbox");
		text.setAttribute("aria-checked", String(savedChecks.includes(index)));
		item.append(text);

		function toggleStep() {
			const checked = !text.classList.contains("checked");
			text.classList.toggle("checked", checked);
			item.classList.toggle("step-complete", checked);
			text.setAttribute("aria-checked", String(checked));
			const checkedSteps = [...items]
				.map((step, stepIndex) => step.querySelector(".step-check").classList.contains("checked") ? stepIndex : -1)
				.filter(stepIndex => stepIndex >= 0);
			localStorage.setItem(storageKey, JSON.stringify(checkedSteps));
			updateProgress();
		}

		text.addEventListener("click", toggleStep);
		text.addEventListener("keydown", event => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				toggleStep();
			}
		});
	});

	items[0]?.closest("ol")?.insertAdjacentElement("afterend", progress);
	updateProgress();
}

const recipeBaselines = {
	"acai-bowl.html": 1,
	"chocolate-mousee.html": 4,
	"chocolate-protien-serve.html": 1,
	"creamcheese-spread.html": 4,
	"green-paobhaji.html": 4,
	"guiltfree-icecream.html": 2,
	"hearty-bowl.html": 4,
	"mexican-kabab.html": 4,
	"oat-cutlet.html": 4,
	"orange-tofu.html": 4,
	"protien-muthiya.html": 4,
	"protien-springroll.html": 4,
	"refreshing-cubes.html": 4,
	"thai-basil-tofu.html": 3,
	"tomato-jam.html": 4
};

function parseQuantity(value) {
	if (value.includes(" ")) {
		const [whole, fraction] = value.split(" ");
		return Number(whole) + parseQuantity(fraction);
	}

	if (value.includes("/")) {
		const [numerator, denominator] = value.split("/");
		return Number(numerator) / Number(denominator);
	}

	return Number(value);
}

function formatQuantity(value) {
	const whole = Math.floor(value + 0.0001);
	const remainder = value - whole;

	if (remainder < 0.01) {
		return String(whole);
	}

	const fractions = [
		[1, 8], [1, 6], [1, 4], [1, 3], [3, 8], [1, 2],
		[5, 8], [2, 3], [3, 4], [5, 6], [7, 8]
	];
	const closest = fractions.reduce((best, fraction) => {
		const difference = Math.abs(remainder - fraction[0] / fraction[1]);
		return difference < best.difference ? { fraction, difference } : best;
	}, { fraction: null, difference: Infinity });

	if (closest.difference < 0.025) {
		const fraction = `${closest.fraction[0]}/${closest.fraction[1]}`;
		return whole ? `${whole} ${fraction}` : fraction;
	}

	return String(Math.round(value * 100) / 100);
}

const scalableUnits = {
	almond: ["almond", "almonds"],
	banana: ["banana", "bananas"],
	carrot: ["carrot", "carrots"],
	chili: ["chili", "chilies"],
	clove: ["clove", "cloves"],
	cube: ["cube", "cubes"],
	cup: ["cup", "cups"],
	cutlet: ["cutlet", "cutlets"],
	date: ["date", "dates"],
	kebab: ["kebab", "kebabs"],
	leaf: ["leaf", "leaves"],
	lemon: ["lemon", "lemons"],
	lime: ["lime", "limes"],
	onion: ["onion", "onions"],
	ounce: ["ounce", "ounces"],
	packet: ["packet", "packets"],
	piece: ["piece", "pieces"],
	pint: ["pint", "pints"],
	potato: ["potato", "potatoes"],
	roll: ["roll", "rolls"],
	scoop: ["scoop", "scoops"],
	serving: ["serving", "servings"],
	tablespoon: ["tablespoon", "tablespoons"],
	teaspoon: ["teaspoon", "teaspoons"],
	tomato: ["tomato", "tomatoes"],
	wrapper: ["wrapper", "wrappers"]
};
const unitNames = Object.values(scalableUnits).flat();
const unitPattern = new RegExp(
	`(\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)(\\s+(?:(?:about|packed|standard|large|medium|small|ripe|dried|mild|green|red|Thai|garlic|round|extra-firm|unsweetened|fresh|frozen|acai|puree)\\s+)*)(${unitNames.join("|")})\\b`,
	"gi"
);

function correctUnitGrammar(value) {
	return value.replace(unitPattern, (match, quantity, spacing, unit) => {
		const forms = Object.values(scalableUnits).find(options =>
			options.includes(unit.toLowerCase())
		);
		const form = parseQuantity(quantity) > 1 ? forms[1] : forms[0];
		return `${quantity}${spacing}${form}`;
	});
}

function scaleNumbers(value, scale) {
	const scaledValue = value.replace(
		/\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/g,
		quantity => formatQuantity(parseQuantity(quantity) * scale)
	);
	return correctUnitGrammar(scaledValue);
}

function addServingControl() {
	const filename = decodeURIComponent(location.pathname.split("/").pop());
	const baseline = recipeBaselines[filename];

	if (!baseline) {
		return;
	}

	const ingredientItems = document.querySelectorAll('[aria-labelledby="ingredients-heading"] li');
	const originalTextNodes = [...ingredientItems].flatMap(item => {
		const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
		const textNodes = [];
		let textNode = walker.nextNode();

		while (textNode) {
			textNodes.push({ node: textNode, value: textNode.nodeValue });
			textNode = walker.nextNode();
		}

		return textNodes;
	});
	const savedServings = Number(localStorage.getItem(`recipe-servings:${location.pathname}`));
	const selectedServings = [2, 4, 6].includes(savedServings) ? savedServings : baseline;
	const meta = document.querySelector(".meta");
	const intro = document.querySelector(".intro");
	const originalMeta = meta?.textContent;
	const originalIntro = intro?.textContent;
	const control = document.createElement("div");
	const label = document.createElement("span");
	const options = document.createElement("div");
	const servingOptions = [...new Set([2, baseline, 4, 6])].sort((first, second) => first - second);

	control.className = "serving-control";
	label.className = "serving-label";
	label.textContent = "Servings";
	options.className = "serving-options";
	options.setAttribute("role", "group");
	options.setAttribute("aria-label", "Choose number of servings");

	function scaleRecipe(servings) {
		const scale = servings / baseline;

		originalTextNodes.forEach(({ node, value }) => {
			node.nodeValue = scaleNumbers(value, scale);
		});

		if (meta) {
			meta.textContent = originalMeta.split("|").map(segment => {
				const isYield = /(serves|makes|pints?|pieces?|rolls?|kebabs?|cutlets?|cubes?)/i.test(segment);
				const isTiming = /(prep|cook|chill|freeze|ready)/i.test(segment);
				return isYield && !isTiming ? scaleNumbers(segment, scale) : segment;
			}).join("|");
		} else if (/makes about [^.]+\./i.test(originalIntro)) {
			intro.textContent = originalIntro.replace(
				/makes about [^.]+\./i,
				yieldText => scaleNumbers(yieldText, scale)
			);
		}

		options.querySelectorAll("button").forEach(button => {
			button.setAttribute("aria-pressed", String(Number(button.value) === servings));
		});
		localStorage.setItem(`recipe-servings:${location.pathname}`, String(servings));
	}

	servingOptions.forEach(servings => {
		const button = document.createElement("button");
		button.type = "button";
		button.value = servings;
		button.textContent = servings;
		button.setAttribute("aria-label", `${servings} ${servings === 1 ? "serving" : "servings"}`);
		button.addEventListener("click", () => scaleRecipe(servings));
		options.append(button);
	});

	control.append(label, options);
	const anchor = document.querySelector(".meta") || document.querySelector(".intro");
	anchor.classList.add("has-serving-control");
	anchor.insertAdjacentElement("afterend", control);
	scaleRecipe(selectedServings);
}

addServingControl();

addChecklist(
	'[aria-labelledby="ingredients-heading"] li',
	`recipe-ingredients:${location.pathname}`,
	"ingredient-check"
);

addStepChecklist(
	'[aria-labelledby="method-heading"] li',
	`recipe-steps:${location.pathname}`
);