/**
 * Smart indexer that recognizes words like "abc12" to be less than "abc100"
 * @name Helper: Sortify
 * @function
 * @param {string} text - text to build an index value for
 * @returns {number} - index value of the provided text
 */
export function sortify(text: string) {
	const reg = /([A-Za-z]+|[0-9]+|.+?)/g;
	const regontxt = text.match(reg);
	if (!regontxt) return 0;
	let score = 0;
	for (const match of regontxt) {
		if (match.match(/^[A-Za-z]+$/)) {
			for (let l = 0; l < match.length; l++)
				score += match.charCodeAt(l);
		} else if (match.match(/^[0-9]+$/)) {
			score += parseInt(match);
		} else {
			for (let l = 0; l < match.length; l++)
				score += match.charCodeAt(l);
		}
	}
	return score;
}
