import { spa, mpa, iso, spa_shell, mpa_shell, iso_shell } from "./data.mjs"
import { getMedian, getAverage } from "./utils.mjs"

const WEIGHT = "weight (KiB)"
const RENDER = "render (ms)"
const VISUAL_COMPLETE_99 = "visualComplete99 (ms)"

const getFieldForFirstNav = (data, field) => {
	return Object.values(data.runs).map((run) => run.firstView.steps[0][field])
}
const getFieldForSubsequentNavs = (data, field, noForm) => {
	return Object.values(data.runs)
		.flatMap((run) => run.firstView.steps.slice(1))
		.filter((step) =>
			noForm != null ? ["Login", "Add"].includes(step.eventName) !== noForm : true,
		)
		.map((step) => step[field])
}

const _v = Object.values(mpa_shell.runs).reduce((obj, run) => {
	for (const { eventName, render, visualComplete99 } of run.firstView.steps.slice(1)) {
		obj[eventName] ??= { render: [], visualComplete99: [] }
		obj[eventName].render.push(render)
		obj[eventName].visualComplete99.push(visualComplete99)
	}
	return obj
}, {})

console.table(
	Object.fromEntries(
		Object.entries(_v).map(([k, { render, visualComplete99 }]) => [
			k,
			{
				render: [getMedian(render) + "ms", getAverage(render) + "ms"].join(" / "),
				visualComplete99: [
					getMedian(visualComplete99) + "ms",
					getAverage(visualComplete99) + "ms",
				].join(" / "),
			},
		]),
	),
)

const step = mpa_shell.runs[3].firstView.steps.forEach(
	({ eventName, render, visualComplete99 }) => {
		console.log({ eventName, render, visualComplete99 })
	},
)
// const { eventName, render } = step
// console.log({ eventName, render })
//process.exit(0)
for (const { label, ...data } of [spa, mpa, iso, spa_shell, mpa_shell, iso_shell]) {
	console.group("→ " + label.slice(0, 3).toUpperCase() + (label.slice(3) ? " + Shell" : ""))
	console.table({
		firstNav: {
			[RENDER]: {
				median: Math.round(getMedian(getFieldForFirstNav(data, "render"))),
				avg: Math.round(getAverage(getFieldForFirstNav(data, "render"))),
			},
			[VISUAL_COMPLETE_99]: {
				median: Math.round(getMedian(getFieldForFirstNav(data, "visualComplete99"))),
				avg: Math.round(getAverage(getFieldForFirstNav(data, "visualComplete99"))),
			},
			[WEIGHT]: {
				median: Math.round(getMedian(getFieldForFirstNav(data, "bytesIn")) / 1024),
				avg: Math.round(getAverage(getFieldForFirstNav(data, "bytesIn")) / 1024),
			},
		},
		subsequentNavs: {
			[RENDER]: {
				median: Math.round(getMedian(getFieldForSubsequentNavs(data, "render"))),
				avg: Math.round(getAverage(getFieldForSubsequentNavs(data, "render"))),
			},
			[VISUAL_COMPLETE_99]: {
				median: Math.round(getMedian(getFieldForSubsequentNavs(data, "visualComplete99"))),
				avg: Math.round(getAverage(getFieldForSubsequentNavs(data, "visualComplete99"))),
			},
			["test_" + VISUAL_COMPLETE_99]: {
				median: Math.round(getMedian(getFieldForSubsequentNavs(data, "visualComplete99", true))),
				avg: Math.round(getAverage(getFieldForSubsequentNavs(data, "visualComplete99", true))),
			},
			[WEIGHT]: {
				median: Math.round(getMedian(getFieldForSubsequentNavs(data, "bytesIn")) / 1024),
				avg: Math.round(getAverage(getFieldForSubsequentNavs(data, "bytesIn")) / 1024),
			},
		},
		wholeFlow: {
			[RENDER]: "      -- no data --      ",
			[VISUAL_COMPLETE_99]: "      -- no data --      ",
			[WEIGHT]: `median: ${Math.round(data.median.firstView.bytesIn / 1024)}`
				.padStart(18, " ")
				.padEnd(24, " "),
		},
	})
	console.groupEnd()
}
