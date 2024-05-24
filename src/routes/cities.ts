import { Router } from "express";

import { City, Department, Region } from "@/types/types";

import regions from "../data/regions.json";
import departments from "../data/departments.json";
import cities from "../data/cities.json";

const router = Router();



export default router;