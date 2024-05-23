

export type City = {
    dep: string;
    name: string;
    slug: string;
    region: string;
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
export type DepartmentResponse = {
    cities: City[];
} & Department;

export type Region = {
    name: string;
    slug: string;
    departments: Department[];
}

export type RegionResponse = {
    departments: DepartmentResponse[];
} & Region;
export type SearchType = "city" | "department" | "region";