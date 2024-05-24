export type regions = Region[];
export type departments = Department[];
export type cities = City[];

export type QueryExtendedFields = "regions" | "departments" | "cities";
export type RegionExtendedWithDepartments = Region & { departments: Department[] };
export type RegionExtendedWithCities = Region & { cities: City[] };
export type RegionExtendedWithDepartmentsAndCities = Region & { departments: (Department & { cities: City[] })[] };
export type DepartmentExtendedWithCities = Department & { cities: City[] };
export type DepartmentExtendedWithRegion = Department & { region: Region };
export type DepartmentExtendedWithCitiesAndRegion = Department & { cities: City[], region: Region };
export type CityExtendedWithRegion = City & { region: Region };
export type CityExtendedWithDepartment = City & { department: Department };
export type CityExtendedWithRegionAndDepartment = City & { region: Region, department: Department };

export type City = {
    dep: string;
    name: string;
    slug: string;
    region: string | Region;
    coord: {
        lat: number;
        lon: number;
    },
    population: number;
    density: number;
}

export type Department = {
    name: string;
    zip: string;
    standard_of_living: number;
}

export type Region = {
    name: string;
    slug: string;
    departments: string[] | Department[]
}

export type FramedNumber = { max?: number, min?: number };
export type GetCityProps = {
	name?: string;
	slug?: string;
	region?: GetRegionProps;
	department?: GetDepartmentProps;
	coord?: {
		lat: number;
        lon: number;
        distance?: FramedNumber;
	};
	population?: FramedNumber;
	density?: FramedNumber;
};
export type GetDepartmentProps = {
	name?: string;
	zip?: string;
	region?: GetRegionProps;
	city?: GetCityProps;
	standard_of_living?: FramedNumber;
};
export type GetRegionProps = {
    name?: string;
    slug?: string;
    department?: GetDepartmentProps;
    city?: GetCityProps;
}