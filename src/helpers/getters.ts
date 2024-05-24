import regions from "../data/regions.json";
import departments from "../data/departments.json";
import cities from "../data/cities.json";

import {
	City,
	Department,
	FramedNumber,
	GetCityProps,
	GetDepartmentProps,
	GetRegionProps,
	Region,
	RegionExtendedWithCities,
	RegionExtendedWithDepartments,
	RegionExtendedWithDepartmentsAndCities,
} from "@/types/types";

import { haversine } from "./calculs";

/* REGIONS */
export function getAllRegions(): Region[] {
	return regions as Region[];
}
export function getRegions(
	{ city, department, name, slug }: GetRegionProps = {},
	values?: Region[]
): Region[] {
	let hasValue = typeof values !== "undefined";

	let sortedByCity: Region[] = [];
	let sortedByDepartment: Region[] = [];
	let sortedByName: Region[] = [];
	let sortedBySlug: Region[] = [];

	values = [...(hasValue ? values : regions)];

	let result: Region[] = [];

	if (name) {
		sortedByName.push(...getRegionsByName({ name }, values));
		if (!sortedByName.length) return sortedByName;
	}
	if (slug) {
		sortedBySlug.push(...getRegionsBySlug({ slug }, values));
		if (!sortedBySlug.length) return sortedBySlug;
	}
	if (city) {
		sortedByCity.push(...getRegionsByCity({ city }, values));
		if (!sortedByCity.length) return sortedByCity;
	}
	if (department) {
		sortedByDepartment.push(
			...getRegionsByDepartment({ department }, values)
		);
		if (!sortedByDepartment.length) return sortedByDepartment;
	}

	if (name) {
		if (result.length)
			result = result.filter((r) =>
				sortedByName.some((s) => s.slug === r.slug)
			);
		else result.push(...sortedByName);
		if (!result.length) return result;
	}
	if (slug) {
		if (result.length)
			result = result.filter((r) =>
				sortedBySlug.some((s) => s.slug === r.slug)
			);
		else result.push(...sortedBySlug);
		if (!result.length) return result;
	}
	if (city) {
		if (result.length)
			result = result.filter((r) =>
				sortedByCity.some((s) => s.slug === r.slug)
			);
		else result.push(...sortedByCity);
		if (!result.length) return result;
	}
	if (department) {
		if (result.length)
			result = result.filter((r) =>
				sortedByDepartment.some((s) => s.slug === r.slug)
			);
		else result.push(...sortedByDepartment);
		if (!result.length) return result;
	}

	// Remove duplicates
	result = result.filter(
		(r, index, self) =>
			self.findIndex((reg) => reg.slug === r.slug) === index
	);

	return result;
}
export function getRegionsByName(
	{ name }: { name: string },
	values?: Region[]
): Region[] {
	let hasValue = typeof values !== "undefined";

	if (!name) return values as Region[];

	name = name.toLowerCase();

	values = [...(hasValue ? values : regions)].map((r) => ({
		...r,
		points: 0,
	}));

	let result = [];

	for (let region of (values as Region[]).filter((r) =>
		r.name.toLowerCase().includes(name)
	)) {
		let temp: Region & { points: number } = { ...region, points: 0 };
		if (region.name.toLowerCase() === name) temp.points += 10;
		if (region.name.toLowerCase().startsWith(name)) temp.points += 5;
		if (region.name.toLowerCase().endsWith(name)) temp.points += 3;
		result.push(temp);
	}

	// remove duplicates
	result = result.filter(
		(r, index, self) =>
			self.findIndex((reg) => reg.slug === r.slug) === index
	);

	return result
		.sort((a, b) => b.points - a.points)
		.map((r) => {
			delete r.points;
			return r;
		});
}
export function getRegionsBySlug(
	{ slug }: { slug: string },
	values?: Region[]
): Region[] {
	let hasValue = typeof values !== "undefined";

	if (!slug) return values as Region[];
	slug = slug.toLowerCase();

	values = [...(hasValue ? values : regions)].map((r) => ({
		...r,
		points: 0,
	}));

	let result = [];

	for (let region of (values as Region[]).filter((r) =>
		r.slug.toLowerCase().includes(slug)
	)) {
		let temp: Region & { points: number } = { ...region, points: 0 };
		if (region.slug.toLowerCase() === slug) temp.points += 10;
		if (region.slug.toLowerCase().startsWith(slug)) temp.points += 5;
		if (region.slug.toLowerCase().endsWith(slug)) temp.points += 3;
		result.push(temp);
	}

	// remove duplicates
	result = result.filter(
		(r, index, self) =>
			self.findIndex((reg) => reg.slug === r.slug) === index
	);

	return result
		.sort((a, b) => b.points - a.points)
		.map((r) => {
			delete r.points;
			return r;
		});
}
export function getRegionsByDepartment(
	{
		department,
	}: {
		department: GetDepartmentProps;
	},
	values?: Region[]
): Region[] {
	let hasValue = typeof values !== "undefined";
	values = [...(hasValue ? values : regions)];

	let result: Region[] = [];

	if (!department) return result;

	let deps = getDepartments({ ...department });

	if (!deps.length) return result;

	for (let region of values as Region[]) {
		if (
			deps
				.map((d) => d.zip)
				.some((d) => (region.departments as string[]).includes(d))
		)
			result.push(region);
	}

	// Remove duplicates
	result = result.filter(
		(r, index, self) =>
			self.findIndex((reg) => reg.slug === r.slug) === index
	);

	return result;
}
export function getRegionsByDepartments(
	departments: GetDepartmentProps[],
	values?: Region[]
): Region[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : regions)];

	let result: Region[] = [];

	if (!departments.length) return result;

	for (let department of departments) {
		let regions = getRegionsByDepartment({ department }, values);

		if (!regions.length) return result;

		result.push(...regions);
	}

	// Remove duplicates
	result = result.filter(
		(r, index, self) =>
			self.findIndex((reg) => reg.slug === r.slug) === index
	);

	return result;
}
export function getRegionsByCity(
	{ city }: { city: GetCityProps },
	values?: Region[]
): Region[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : regions)];

	let result: Region[] = [];

	if (!city) return result;

	let cities = getCities({ ...city });

	if (!cities.length) return result;

	for (let region of values as Region[]) {
		if (
			cities
				.map((c) => c.dep)
				.some((c) => (region.departments as string[]).includes(c))
		)
			result.push(region);
	}

	// Remove duplicates
	result = result.filter(
		(r, index, self) =>
			self.findIndex((reg) => reg.slug === r.slug) === index
	);

	return result;
}
export function getRegionsByCities(
	cities: GetCityProps[],
	values?: Region[]
): Region[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : regions)];

	let result: Region[] = [];

	if (!cities.length) return result;

	for (let city of cities) {
		let regions = getRegionsByCity({ city }, values);

		if (!regions.length) return result;

		result.push(...regions);
	}

	// Remove duplicates
	result = result.filter(
		(r, index, self) =>
			self.findIndex((reg) => reg.slug === r.slug) === index
	);

	return result;
}

/* DEPARTMENTS */
export function getAllDepartments(): Department[] {
	return departments as Department[];
}
export function getDepartments(
	{ name, zip, standard_of_living, city, region }: GetDepartmentProps = {},
	values?: Department[]
): Department[] {
	let hasValue = typeof values !== "undefined";

	let sortedByName: Department[] = [];
	let sortedByZip: Department[] = [];
	let sortedByStandardOfLiving: Department[] = [];
	let sortedByCity: Department[] = [];
	let sortedByRegion: Department[] = [];

	values = [...(hasValue ? values : (departments as Department[]))];

	let result: Department[] = [];

	if (name) {
		sortedByName.push(...getDepartmentsByName({ name }, values));
		if (!sortedByName.length) return sortedByName;
	}
	if (zip) {
		sortedByZip.push(...getDepartmentsByZip({ zip }, values));
		if (!sortedByZip.length) return sortedByZip;
	}
	if (standard_of_living) {
		sortedByStandardOfLiving.push(
			...getDepartmentsByStandardOfLiving({ standard_of_living }, values)
		);
		if (!sortedByStandardOfLiving.length) return sortedByStandardOfLiving;
	}
	if (city) {
		sortedByCity.push(...getDepartmentsByCity({ city }, values));
		if (!sortedByCity.length) return sortedByCity;
	}
	if (region) {
		sortedByRegion.push(...getDepartmentsByRegion({ region }, values));
		if (!sortedByRegion.length) return sortedByRegion;
	}

	if (name) {
		if (result.length)
			result = result.filter((d) =>
				sortedByName.some((s) => s.zip === d.zip)
			);
		else result.push(...sortedByName);
		if (!result.length) return result;
	}
	if (zip) {
		if (result.length)
			result = result.filter((d) =>
				sortedByZip.some((s) => s.zip === d.zip)
			);
		else result.push(...sortedByZip);
		if (!result.length) return result;
	}
	if (standard_of_living) {
		if (result.length)
			result = result.filter((d) =>
				sortedByStandardOfLiving.some((s) => s.zip === d.zip)
			);
		else result.push(...sortedByStandardOfLiving);
		if (!result.length) return result;
	}
	if (city) {
		if (result.length)
			result = result.filter((d) =>
				sortedByCity.some((s) => s.zip === d.zip)
			);
		else result.push(...sortedByCity);
		if (!result.length) return result;
	}
	if (region) {
		if (result.length)
			result = result.filter((d) =>
				sortedByRegion.some((s) => s.zip === d.zip)
			);
		else result.push(...sortedByRegion);
		if (!result.length) return result;
	}

	// Remove duplicates
	result = result.filter(
		(d, index, self) => self.findIndex((dep) => dep.zip === d.zip) === index
	);

	return result;
}
export function getDepartmentsByName(
	{ name }: { name: string },
	values?: Department[]
): Department[] {
	let hasValue = typeof values !== "undefined";

	if (!name) return values as Department[];
	name = name.toLowerCase();

	values = [...((hasValue ? values : departments) as Department[])].map(
		(r) => ({
			...r,
			points: 0,
		})
	);

	let result: (Department & { points: number })[] = [];

	for (let department of (values as Department[]).filter((d) =>
		d.name.toLowerCase().includes(name)
	)) {
		let temp: Department & { points: number } = {
			...department,
			points: 0,
		};
		if (department.name.toLowerCase() === name) temp.points += 10;
		if (department.name.toLowerCase().startsWith(name)) temp.points += 5;
		if (department.name.toLowerCase().endsWith(name)) temp.points += 3;
		result.push(temp);
	}

	// remove duplicates
	result = result.filter(
		(d, index, self) => self.findIndex((dep) => dep.zip === d.zip) === index
	);

	return result
		.sort((a, b) => b.points - a.points)
		.map((d) => {
			delete d.points;
			return d;
		});
}
export function getDepartmentsByZip(
	{ zip }: { zip: string },
	values?: Department[]
): Department[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (departments as Department[]))].map(
		(r) => ({
			...r,
			points: 0,
		})
	);

	let result: (Department & { points: number })[] = [];

	for (let department of (values as Department[]).filter((d) =>
		d.zip.includes(zip)
	)) {
		let temp: Department & { points: number } = {
			...department,
			points: 0,
		};
		if (department.zip === zip) temp.points += 10;
		if (department.zip.startsWith(zip)) temp.points += 5;
		if (department.zip.endsWith(zip)) temp.points += 3;
		result.push(temp);
	}

	// remove duplicates
	result = result.filter(
		(d, index, self) => self.findIndex((dep) => dep.zip === d.zip) === index
	);

	return result
		.sort((a, b) => b.points - a.points)
		.map((d) => {
			delete d.points;
			return d;
		});
}
export function getDepartmentsByStandardOfLiving(
	{
		standard_of_living,
	}: {
		standard_of_living: FramedNumber;
	},
	values?: Department[]
): Department[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (departments as Department[]))];

	return (values as Department[])
		.filter(
			(d) =>
				d.standard_of_living <= (standard_of_living.max || Infinity) &&
				d.standard_of_living >= (standard_of_living.min || 0)
		)
		.sort((a, b) => b.standard_of_living - a.standard_of_living);
}
export function getDepartmentsByCity(
	{
		city,
	}: {
		city: GetCityProps;
	},
	values?: Department[]
): Department[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (departments as Department[]))];

	let result: Department[] = [];

	if (!city) return result;

	let cities = getCities({ ...city });

	if (!cities.length) return result;

	for (let department of values as Department[]) {
		if (cities.map((c) => c.dep).includes(department.zip))
			result.push(department);
	}

	// Remove duplicates
	result = result.filter(
		(d, index, self) => self.findIndex((dep) => dep.zip === d.zip) === index
	);

	return result;
}
export function getDepartmentsByCities(
	cities: GetCityProps[],
	values?: Department[]
): Department[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (departments as Department[]))];

	let result: Department[] = [];

	if (!cities.length) return result;

	for (let city of cities) {
		let deps = getDepartmentsByCity({ city }, values);

		if (!deps.length) return result;

		result.push(...deps);
	}

	// Remove duplicates
	result = result.filter(
		(d, index, self) => self.findIndex((dep) => dep.zip === d.zip) === index
	);

	return result;
}
export function getDepartmentsByRegion(
	{
		region,
	}: {
		region: GetRegionProps;
	},
	values?: Department[]
): Department[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (departments as Department[]))];

	let result: Department[] = [];

	if (!region) return result;

	let regions = getRegions({ ...region });

	if (!regions.length) return result;

	for (let department of values as Department[]) {
		if (
			regions
				.map((r) => r.departments)
				.flat()
				.includes(department.zip)
		)
			result.push(department);
	}

	// Remove duplicates
	result = result.filter(
		(d, index, self) => self.findIndex((dep) => dep.zip === d.zip) === index
	);

	return result;
}

/* CITIES */
export function getAllCities(): City[] {
	return cities as City[];
}
export function getCities(
	{
		name,
		slug,
		region,
		department,
		coord,
		population,
		density,
	}: GetCityProps = {},
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	let sortedByName: City[] = [];
	let sortedBySlug: City[] = [];
	let sortedByRegion: City[] = [];
	let sortedByDepartment: City[] = [];
	let sortedByCoord: City[] = [];
	let sortedByPopulation: City[] = [];
	let sortedByDensity: City[] = [];

	values = [...(hasValue ? values : (cities as City[]))];

	let result: City[] = [];

	if (name) {
		sortedByName.push(...getCitiesByName({ name }, values));
		if (!sortedByName.length) return sortedByName;
	}
	if (slug) {
		sortedBySlug.push(...getCitiesBySlug({ slug }, values));
		if (!sortedBySlug.length) return sortedBySlug;
	}
	if (coord) {
		sortedByCoord.push(...getCitiesByCoord({ ...coord }, values));
		if (!sortedByCoord.length) return sortedByCoord;
	}
	if (population) {
		sortedByPopulation.push(
			...getCitiesByPopulation({ population }, values)
		);
		if (!sortedByPopulation.length) return sortedByPopulation;
	}
	if (density) {
		sortedByDensity.push(...getCitiesByDensity({ density }, values));
		if (!sortedByDensity.length) return sortedByDensity;
	}
	if (region) {
		sortedByRegion.push(...getCitiesByRegion({ region }, values));
		if (!sortedByRegion.length) return sortedByRegion;
	}
	if (department) {
		sortedByDepartment.push(
			...getCitiesByDepartment({ department }, values)
		);
		if (!sortedByDepartment.length) return sortedByDepartment;
	}

	if (name) {
		if (result.length)
			result = result.filter((c) =>
				sortedByName.some((s) => s.slug === c.slug)
			);
		else result.push(...sortedByName);
		if (!result.length) return result;
	}
	if (slug) {
		if (result.length)
			result = result.filter((c) =>
				sortedBySlug.some((s) => s.slug === c.slug)
			);
		else result.push(...sortedBySlug);
		if (!result.length) return result;
	}
	if (coord) {
		if (result.length)
			result = result.filter((c) =>
				sortedByCoord.some((s) => s.slug === c.slug)
			);
		else result.push(...sortedByCoord);
		if (!result.length) return result;
	}
	if (population) {
		if (result.length)
			result = result.filter((c) =>
				sortedByPopulation.some((s) => s.slug === c.slug)
			);
		else result.push(...sortedByPopulation);
		if (!result.length) return result;
	}
	if (density) {
		if (result.length)
			result = result.filter((c) =>
				sortedByDensity.some((s) => s.slug === c.slug)
			);
		else result.push(...sortedByDensity);
		if (!result.length) return result;
	}
	if (department) {
		if (result.length)
			result = result.filter((c) =>
				sortedByDepartment.some((s) => s.slug === c.slug)
			);
		else result.push(...sortedByDepartment);
		if (!result.length) return result;
	}
	if (region) {
		if (result.length)
			result = result.filter((c) =>
				sortedByRegion.some((s) => s.slug === c.slug)
			);
		else result.push(...sortedByRegion);
		if (!result.length) return result;
	}

	// Remove duplicates
	result = result.filter(
		(c, index, self) =>
			self.findIndex((city) => city.slug === c.slug) === index
	);

	return result;
}
export function getCitiesByName(
	{ name }: { name: string },
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	if (!name) return values as City[];
	name = name.toLowerCase();

	values = [...(hasValue ? values : (cities as City[]))].map((r) => ({
		...r,
		points: 0,
	}));

	let result: (City & { points: number })[] = [];

	for (let city of (values as City[]).filter((c) =>
		c.name.toLowerCase().includes(name)
	)) {
		let temp: City & { points: number } = { ...city, points: 0 };
		if (city.name.toLowerCase() === name) temp.points += 10;
		if (city.name.toLowerCase().startsWith(name)) temp.points += 5;
		if (city.name.toLowerCase().endsWith(name)) temp.points += 3;
		result.push(temp);
	}

	// remove duplicates
	result = result.filter(
		(c, index, self) =>
			self.findIndex((city) => city.slug === c.slug) === index
	);

	return result
		.sort((a, b) => b.points - a.points)
		.map((c) => {
			delete c.points;
			return c;
		});
}
export function getCitiesBySlug(
	{ slug }: { slug: string },
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";
	
	if (!slug) return values as City[];
	slug = slug.toLowerCase();

	values = [...(hasValue ? values : (cities as City[]))].map((r) => ({
		...r,
		points: 0,
	}));

	let result: (City & { points: number })[] = [];

	for (let city of (values as City[]).filter((c) =>
		c.slug.toLowerCase().includes(slug)
	)) {
		let temp: City & { points: number } = { ...city, points: 0 };
		if (city.slug.toLowerCase() === slug) temp.points += 10;
		if (city.slug.toLowerCase().startsWith(slug)) temp.points += 5;
		if (city.slug.toLowerCase().endsWith(slug)) temp.points += 3;
		result.push(temp);
	}

	// remove duplicates
	result = result.filter(
		(c, index, self) =>
			self.findIndex((city) => city.slug === c.slug) === index
	);

	return result
		.sort((a, b) => b.points - a.points)
		.map((c) => {
			delete c.points;
			return c;
		});
}
export function getCitiesByCoord(
	{
		lat,
		lon,
		distance,
	}: {
		lat: number;
		lon: number;
		distance?: FramedNumber;
	},
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (cities as City[]))];

	return (values as City[])
		.filter((c) => {
			const distanceBetween = haversine([{ lat, lon }, c.coord]);
			return (
				distanceBetween >=
					(typeof distance?.min == "number"
						? Math.abs(distance.min)
						: 0) &&
				distanceBetween <=
					(typeof distance?.max == "number"
						? Math.abs(distance.max)
						: 100)
			);
		})
		.sort((a, b) => {
			const distanceA = haversine([{ lat, lon }, a.coord]);
			const distanceB = haversine([{ lat, lon }, b.coord]);
			return distanceA - distanceB; // Ascending order
		});
}
export function getCitiesByPopulation(
	{
		population,
	}: {
		population: FramedNumber;
	},
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (cities as City[]))];

	return (values as City[])
		.filter(
			(c) =>
				c.population <= (population.max || Infinity) &&
				c.population >= (population.min || 0)
		)
		.sort((a, b) => b.population - a.population);
}
export function getCitiesByDensity(
	{
		density,
	}: {
		density: FramedNumber;
	},
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (cities as City[]))];

	return (cities as City[])
		.filter(
			(c) =>
				c.density <= (density.max || Infinity) &&
				c.density >= (density.min || 0)
		)
		.sort((a, b) => b.density - a.density);
}
export function getCitiesByRegion(
	{
		region,
	}: {
		region: GetRegionProps;
	},
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (cities as City[]))];

	let result: City[] = [];

	if (!region) return result;

	for (let city of values as City[]) {
		let deps = getDepartmentsByRegion({ region });
		if (!deps.length) return result;

		if (deps.map((d) => d.zip).includes(city.dep)) result.push(city);
	}

	// Remove duplicates
	result = result.filter(
		(c, index, self) =>
			self.findIndex((city) => city.slug === c.slug) === index
	);

	return result;
}
export function getCitiesByRegions(
	regions: GetRegionProps[],
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (cities as City[]))];

	let result: City[] = [];

	if (!regions.length) return result;

	for (let region of regions) {
		let cities = getCitiesByRegion({ region }, values);

		if (!cities.length) return result;

		result.push(...cities);
	}

	// Remove duplicates
	result = result.filter(
		(c, index, self) =>
			self.findIndex((city) => city.slug === c.slug) === index
	);

	return result;
}
export function getCitiesByDepartment(
	{
		department,
	}: {
		department: GetDepartmentProps;
	},
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (cities as City[]))];

	let result: City[] = [];

	if (!department) return result;

	let deps = getDepartments({ ...department });

	if (!deps.length) return result;

	for (let city of values as City[]) {
		if (deps.map((d) => d.zip).includes(city.dep)) result.push(city);
	}

	// Remove duplicates
	result = result.filter(
		(c, index, self) =>
			self.findIndex((city) => city.slug === c.slug) === index
	);

	return result;
}
export function getCitiesByDepartments(
	departments: GetDepartmentProps[],
	values?: City[]
): City[] {
	let hasValue = typeof values !== "undefined";

	values = [...(hasValue ? values : (cities as City[]))];

	let result: City[] = [];

	if (!departments.length) return result;

	for (let department of departments) {
		let cities = getCitiesByDepartment({ department }, values);

		if (!cities.length) return result;

		result.push(...cities);
	}

	// Remove duplicates
	result = result.filter(
		(c, index, self) =>
			self.findIndex((city) => city.slug === c.slug) === index
	);

	return result;
}
