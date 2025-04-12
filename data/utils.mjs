const isEven = (num) => num % 2 === 0
const sum = (nums) => nums.reduce((sum, val) => sum + val, 0)
export const getAverage = (vals) => sum(vals) / vals.length
export const getMedian = (vals) => {
	const sorted = [...vals].sort((a, b) => a - b)
	return isEven(sorted.length)
		? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
		: sorted[Math.floor(sorted.length / 2)]
}
