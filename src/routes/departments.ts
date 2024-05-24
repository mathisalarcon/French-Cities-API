import { Router } from "express";

import {
	City,
	Department,
	GetDepartmentProps,
	GetRegionProps,
	QueryExtendedFields,
	Region,
	RegionExtendedWithCities,
	RegionExtendedWithDepartments,
	RegionExtendedWithDepartmentsAndCities,
} from "@/types/types";
import {
    getAllDepartments,
	getCitiesByDepartment,
	getCitiesByRegion,
	getDepartments,
	getDepartmentsByRegion,
	getRegions,
} from "../helpers/getters";

const router = Router();

router.get("/departments", (req, res) => {
    const name: string = req.query.name as string;
    const zip: string = req.query.zip as string;
	const regionName: string = req.query.regionName as string;
	const regionSlug: string = req.query.regionSlug as string;
	const standardOfLivingMin: number = parseInt(
		req.query.standardOfLivingMin as string
	);
	const standardOfLivingMax: number = parseInt(
		req.query.standardOfLivingMax as string
	);
	const cityName: string = req.query.cityName as string;
	const citySlug: string = req.query.citySlug as string;
	const cityLat: number = parseInt(req.query.cityLat as string);
	const cityLon: number = parseInt(req.query.cityLon as string);
	const cityDistanceMin: number = parseInt(
		req.query.cityDistanceMin as string
	);
	const cityDistanceMax: number = parseInt(
		req.query.cityDistanceMax as string
	);
	const cityPopulationMin: number = parseInt(
		req.query.cityPopulationMin as string
	);
	const cityPopulationMax: number = parseInt(
		req.query.cityPopulationMax as string
	);
	const cityDensityMin: number = parseInt(req.query.cityDensityMin as string);
	const cityDensityMax: number = parseInt(req.query.cityDensityMax as string);

	let obj: GetDepartmentProps = {};
	if (name) obj.name = name;
	if (zip) obj.zip = zip;
	if (regionName) obj.region = { name: regionName };
	if (regionSlug)
		obj.region = { slug: regionSlug, ...(obj.region || {}) };
    if (standardOfLivingMin) obj.standard_of_living = { min: standardOfLivingMin };
    if (standardOfLivingMax) obj.standard_of_living = { max: standardOfLivingMax, ...obj.standard_of_living };
	if (cityName) obj.city = { name: cityName };
	if (citySlug) obj.city = { slug: citySlug, ...(obj.city || {}) };
	if (cityLat && cityLon)
		obj.city = {
			coord: { lat: cityLat, lon: cityLon },
			...(obj.city || {}),
		};
	if (cityDistanceMin)
		obj.city = {
			coord: { distance: { min: cityDistanceMin }, ...obj.city?.coord },
			...(obj.city || {}),
		};
	if (cityDistanceMax)
		obj.city = {
			coord: {
				distance: {
					max: cityDistanceMax,
					...obj.city?.coord?.distance,
				},
				...obj.city?.coord,
			},
			...(obj.city || {}),
		};
	if (cityPopulationMin)
		obj.city = { population: { min: cityPopulationMin }, ...obj.city };
	if (cityPopulationMax)
		obj.city = {
			population: { max: cityPopulationMax, ...obj.city?.population },
			...obj.city,
		};
	if (cityDensityMin)
		obj.city = { density: { min: cityDensityMin }, ...obj.city };
	if (cityDensityMax)
		obj.city = {
			density: { max: cityDensityMax, ...obj.city?.density },
			...obj.city,
		};

    const departments = Object.keys(obj).length ? getDepartments(obj) : getAllDepartments();
    
	const fields: QueryExtendedFields[] = (
		req.query.fields ? (req.query.fields as string).split(",") : []
    ) as QueryExtendedFields[];
    
    if (fields.includes("regions") && fields.includes("cities")) {
        const departmentsWithRegionsAndCities: Department[] = departments.map((department) => {
            return {
                ...department,
                cities: getCitiesByDepartment({ department: { ...department, standard_of_living: undefined } }),
            };
        });

        res.json({ success: true, results: departmentsWithRegionsAndCities });
        return;
    } else if (fields.includes("regions")) {
        const departmentsWithRegions: Department[] = departments.map((department) => {
            return {
                ...department,
                cities: getCitiesByDepartment({ department: { ...department, standard_of_living: undefined } }),
            };
        });

        res.json({ success: true, results: departmentsWithRegions });
        return;
    } else if (fields.includes("cities")) {
        const departmentsWithCities: Department[] = departments.map((department) => {
            return {
                ...department,
                cities: getCitiesByDepartment({ department: { ...department, standard_of_living: undefined } }),
            };
        });

        res.json({ success: true, results: departmentsWithCities });
        return;
    };

    res.json({ success: true, results: departments });
});

export default router;
