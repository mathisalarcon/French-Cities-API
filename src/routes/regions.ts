import { Router } from "express";

import { City, Department, GetRegionProps, QueryExtendedFields, Region, RegionExtendedWithCities, RegionExtendedWithDepartments, RegionExtendedWithDepartmentsAndCities } from "@/types/types";
import { getAllRegions, getCitiesByDepartment, getCitiesByRegion, getDepartmentsByRegion, getRegions } from "../helpers/getters";

const router = Router();

router.get("/regions", (req, res) => {
    const name: string = req.query.name as string;
    const slug: string = req.query.slug as string;
    const departmentName: string = req.query.departmentName as string;
    const departmentZip: string = req.query.departmentZip as string;
    const departmentStandardOfLivingMin: number = parseInt(req.query.departmentStandardOfLivingMin as string);
    const departmentStandardOfLivingMax: number = parseInt(req.query.departmentStandardOfLivingMax as string);
    const cityName: string = req.query.cityName as string;
    const citySlug: string = req.query.citySlug as string;
    const cityLat: number = parseInt(req.query.cityLat as string);
    const cityLon: number = parseInt(req.query.cityLon as string);
    const cityDistanceMin: number = parseInt(req.query.cityDistanceMin as string);
    const cityDistanceMax: number = parseInt(req.query.cityDistanceMax as string);
    const cityPopulationMin: number = parseInt(req.query.cityPopulationMin as string);
    const cityPopulationMax: number = parseInt(req.query.cityPopulationMax as string);
    const cityDensityMin: number = parseInt(req.query.cityDensityMin as string);
    const cityDensityMax: number = parseInt(req.query.cityDensityMax as string);

    let obj: GetRegionProps = {};
    if (name) obj.name = name;
    if (slug) obj.slug = slug;
    if (departmentName) obj.department = { name: departmentName };
    if (departmentZip) obj.department = { zip: departmentZip, ...(obj.department || {}) };
    if (departmentStandardOfLivingMin) obj.department = { standard_of_living: { min: departmentStandardOfLivingMin }, ...(obj.department || {}) };
    if (departmentStandardOfLivingMax) obj.department = { standard_of_living: { max: departmentStandardOfLivingMax, ...obj.department?.standard_of_living }, ...(obj.department || {}) };
    if (cityName) obj.city = { name: cityName };
    if (citySlug) obj.city = { slug: citySlug, ...(obj.city || {}) };
    if (cityLat && cityLon) obj.city = { coord: { lat: cityLat, lon: cityLon }, ...(obj.city || {}) };
    if (cityDistanceMin) obj.city = { coord: { distance: { min: cityDistanceMin }, ...obj.city?.coord }, ...(obj.city || {}) };
    if (cityDistanceMax) obj.city = { coord: { distance: { max: cityDistanceMax, ...obj.city?.coord?.distance }, ...obj.city?.coord }, ...(obj.city || {}) };
    if (cityPopulationMin) obj.city = { population: { min: cityPopulationMin }, ...obj.city };
    if (cityPopulationMax) obj.city = { population: { max: cityPopulationMax, ...obj.city?.population }, ...obj.city };
    if (cityDensityMin) obj.city = { density: { min: cityDensityMin }, ...obj.city };
    if (cityDensityMax) obj.city = { density: { max: cityDensityMax, ...obj.city?.density }, ...obj.city };

    const regions = Object.keys(obj).length ? getRegions(obj) : getAllRegions();
    
    const fields: QueryExtendedFields[] = (req.query.fields ? (req.query.fields as string).split(",") : []) as QueryExtendedFields[];
    if (fields.includes("departments") && fields.includes("cities")) {
        const regionsWithDepartmentsAndCities: RegionExtendedWithDepartmentsAndCities[] = regions.map((region) => {
            return {
                ...region,
                departments: getDepartmentsByRegion({ region }).map((department) => {
                    return {
                        ...department,
                        cities: getCitiesByDepartment({ department: { ...department, standard_of_living: { max: departmentStandardOfLivingMax, min: departmentStandardOfLivingMin } } }),
                    };
                })
            };
        });

        res.json({ success: true, results: regionsWithDepartmentsAndCities });
        return;
    } else if (fields.includes("departments")) {
        const regionsWithDepartments: RegionExtendedWithDepartments[] = regions.map((region) => {
            return {
                ...region,
                departments: getDepartmentsByRegion({ region }),
            };
        });

        res.json({ success: true, results: regionsWithDepartments });
        return;
    } else if (fields.includes("cities")) {
        const regionsWithCities: RegionExtendedWithCities[] = regions.map((region) => {
            return {
                ...region,
                cities: getCitiesByRegion({ region }),
            };
        });

        res.json({ success: true, results: regionsWithCities });
        return;
    };

    res.json({ success: true, results: regions });
});


export default router;
