import { Router } from "express";

import {
	City,
	Department,
	GetCityProps,
	GetDepartmentProps,
	GetRegionProps,
	QueryExtendedFields,
	Region,
	RegionExtendedWithCities,
	RegionExtendedWithDepartments,
	RegionExtendedWithDepartmentsAndCities,
} from "@/types/types";
import {
    getAllCities,
	getAllDepartments,
	getCities,
	getCitiesByDepartment,
	getCitiesByRegion,
	getDepartments,
	getDepartmentsByRegion,
	getRegions,
} from "../helpers/getters";

const router = Router();

router.get("/cities", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : Infinity;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const name: string = req.query.name as string;
    const slug: string = req.query.slug as string;
    const lat: number = parseInt(req.query.lat as string);
    const lon: number = parseInt(req.query.lon as string);
    const distanceMin: number = parseInt(req.query.distanceMin as string);
    const distanceMax: number = parseInt(req.query.distanceMax as string);
    const populationMin: number = parseInt(req.query.populationMin as string);
    const populationMax: number = parseInt(req.query.populationMax as string);
    const densityMin: number = parseInt(req.query.densityMin as string);
    const densityMax: number = parseInt(req.query.densityMax as string);

	const regionName: string = req.query.regionName as string;
	const regionSlug: string = req.query.regionSlug as string;
	const departmentStandardOfLivingMin: number = parseInt(
		req.query.standardOfLivingMin as string
	);
	const departmentStandardOfLivingMax: number = parseInt(
		req.query.standardOfLivingMax as string
    );
    const departmentName: string = req.query.departmentName as string;
    const departmentZip: string = req.query.departmentZip as string;

	let obj: GetCityProps = {};
	if (name) obj.name = name;
	if (slug) obj.slug = slug;
	if (regionName) obj.region = { name: regionName };
    if (regionSlug) obj.region = { slug: regionSlug, ...(obj.region || {}) };
    if (lat && lon) obj.coord = { lat, lon };
    if (distanceMin) obj.coord = { distance: { min: distanceMin }, ...obj.coord };
    if (distanceMax) obj.coord = { distance: { max: distanceMax, ...obj.coord.distance }, ...obj.coord };
    if (populationMin) obj.population = { min: populationMin };
    if (populationMax) obj.population = { max: populationMax, ...obj.population };
    if (densityMin) obj.density = { min: densityMin };
    if (densityMax) obj.density = { max: densityMax, ...obj.density };
    if (departmentStandardOfLivingMin) obj.department = { standard_of_living: { min: departmentStandardOfLivingMin } };
    if (departmentStandardOfLivingMax) obj.department = { standard_of_living: { max: departmentStandardOfLivingMax, ...obj.department?.standard_of_living } };
    if (departmentName) obj.department = { name: departmentName };
    if (departmentZip) obj.department = { zip: departmentZip, ...(obj.department || {}) };

	const cities = Object.keys(obj).length
		? getCities(obj)
		: getAllCities();

	const fields: QueryExtendedFields[] = (
		req.query.fields ? (req.query.fields as string).split(",") : []
	) as QueryExtendedFields[];

    if (fields.includes("regions") && fields.includes("departments")) {
        const citiesWithRegionsAndDepartments: City[] = cities.map((city) => {
            return {
                ...city,
                departments: getDepartmentsByRegion({ region: { name: city.region as string } }),
            };
        });

        res.json({ success: true, results: citiesWithRegionsAndDepartments.slice(offset, offset + limit) });
        return;
    } else if (fields.includes("regions")) {
        const citiesWithRegions: City[] = cities.map((city) => {
            return {
                ...city,
                region: getRegions({ name: city.region as string })[0],
            };
        });

        res.json({ success: true, results: citiesWithRegions.slice(offset, offset + limit) });
        return;
    } else if (fields.includes("departments")) {
        const citiesWithDepartments: City[] = cities.map((city) => {
            return {
                ...city,
                departments: getDepartmentsByRegion({ region: { name: city.region as string } }),
            };
        });

        res.json({ success: true, results: citiesWithDepartments.slice(offset, offset + limit) });
        return;
    };

    res.json({ success: true, results: cities.slice(offset, offset + limit) });
});

export default router;
