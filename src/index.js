let clans = [];
let allCount = [];

let template = "";

const generateTemplate = (text) => {
	template = text.replace(/\d{3,8}/g, "<number>");
	console.log(template);
};

const getClans = async () => {
	try {
		const clanURL =
			"https://corsproxy.io/?" +
			encodeURIComponent(
				"https://docs.google.com/spreadsheets/d/e/2PACX-1vRXM-ulyWgRCoURaqhs4s8_48D5m9vfUCFmqpOeZA6ZgH2kSLnEP-IIqbj9Z-6fHCgafc8skv5vj8hC/pub?output=csv"
			);

		const res = await fetch(clanURL);
		const text = await res.text();

		console.log(text);

		const regex = /\/(\d+)$/gm; // Matches the last sequence of digits after the last slash
		const matches = [...text.trim().matchAll(regex)];

		const templateMatch = text.trim().match(/^.*$/m)[0];

		if (templateMatch.trim() !== " ") generateTemplate(templateMatch);

		clans = matches.map((match) => {
			return { url: match[1] };
		});

		console.log("Clans", clans);

		// clans.push({ url: match[1] });
	} catch (error) {
		console.log(error);
	}
};

let lowValue = "text";
let attempts = 0;
const populateClans = async (clan, ind) => {
	try {
		const newURL = `https://www.bungie.net/Platform/GroupV2/${clan.url}`;
		const res = await fetch(newURL, {
			method: "GET",
			headers: {
				"X-API-Key": "02199866e269443887e47a0bf44aabd8",
			},
		});
		const text = await res.text();
		const json = JSON.parse(text);

		if (!json.Response.detail === undefined) return;
		const { detail } = json.Response;

		const { memberCount } = detail;

		// console.log('Detail', detail);

		if (lowValue.number > memberCount || attempts === 0) {
			lowValue = { ind: ind, number: memberCount, name: detail.name };
		}

		allCount.push({
			name: detail.name,
			members: memberCount,
			url: newURL,
		});

		if (attempts === clans.length - 1)
			window.dispatchEvent(new Event("parse-complete"));

		attempts++;
	} catch (error) {
		console.log(error);
	}
};

(async () => {
	const { href } = window.location;
	const { hash } = window.location;

	// console.log(window.location.hash,window.location);

	if (
		!href.includes("localhost:3000") &&
		!href.includes("directactionclan") &&
		!href.includes("barrytickle.vercel")
	)
		return;

	await getClans();
	clans.forEach(populateClans);

	window.addEventListener("parse-complete", function () {
		// console.log('lowValue', lowValue);

		const url = template.replace("<number>", clans[lowValue.ind].url);

		if (hash === "") {
			window.location.href = url;
		}
	});
})();
