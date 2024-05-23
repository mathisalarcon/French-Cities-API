import express from "express";
import {
	City,
	Department,
	DepartmentResponse,
	Region,
	RegionResponse,
	SearchType,
} from "./types/types";

const regions: Region[] = require("./data/regions.json");
const cities: City[] = require("./data/cities.json");

const app = express()
	.use(express.urlencoded({ extended: true }))
	.use(express.json());

app.get("/query", (req, res) => {
	const query = decodeURIComponent(req.query.q as string);
	const type = req.query.type as SearchType;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

	let response: any;

	if (!type) {
		const cityResuls = searchCity(query as string);
		const departmentResults = searchDepartment(query as string);
		const regionResults = searchRegion(query as string);

		let globalResults: (City | Department | Region)[] = cityResuls
			.concat(cityResuls, departmentResults as any, regionResults as any)
			.sort((a, b) => {
				return (a as any).name.localeCompare((b as any).name);
			});

		res.json({
			success: true,
			results: {
				city: cityResuls.slice(0, limit),
				department: departmentResults.slice(0, limit),
				region: regionResults.slice(0, limit),
				global: globalResults.slice(0, limit),
			},
		});
	} else if (type === "city") {
		res.json({
			success: true,
			results: searchCity(query as string).slice(0, limit),
		});
	} else if (type === "department") {
		const results: DepartmentResponse[] = searchDepartment(query as string)
			.map((department) => {
				return {
					...department,
					cities: cities.filter(
						(city) => city.dep === department.zip
					),
				};
			})
			.slice(0, limit);
		res.json({ success: true, results });
	} else if (type === "region") {
		const results: RegionResponse[] = searchRegion(query as string)
			.map((region) => {
				return {
					...region,
					departments: region.departments.map((department) => {
						return {
							...department,
							cities: cities.filter(
								(city) => city.dep === department.zip
							),
						};
					}),
				};
			})
			.slice(0, limit);
		res.json({ success: true, results });
	} else {
		return res.status(400).json({
			success: false,
			error: {
				code: 400,
				message:
					"Invalid search type. Must be 'city', 'department' or 'region'",
			},
		});
	}
});

function searchCity(query: string): City[] {
	let results = cities.filter((city) =>
		city.name.toLowerCase().includes(query.toLowerCase())
	);
	return results.sort((a, b) => b.population - a.population);
}
function searchDepartment(query: string): Department[] {
	let results = regions
		.flatMap((region) => region.departments)
		.filter((department) =>
			department.name.toLowerCase().includes(query.toLowerCase())
		);
	return results.sort((a, b) => a.name.localeCompare(b.name));
}
function searchRegion(query: string): Region[] {
	let results = regions.filter((region) =>
		region.name.toLowerCase().includes(query.toLowerCase())
	);
	return results.sort((a, b) => a.name.localeCompare(b.name));
}

app.listen(25578, () => {
	console.log("Server started on port 25578");
});
