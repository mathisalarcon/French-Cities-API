import express from "express";
import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import { exec } from "child_process";

import citiesRouter from "./routes/cities";
import departmentsRouter from "./routes/departments";
import regionsRouter from "./routes/regions";
import { getCities, getCitiesByRegion } from "./helpers/getters";
import { City } from "./types/types";

import analytics from "./middlewares/analytics";

const app = express()
	.use(express.urlencoded({ extended: true }))
	.use(express.json())
	.use(analytics)
	.use(citiesRouter)
	.use(departmentsRouter)
	.use(regionsRouter);

app.listen(25578, () => {
	console.log("Server started on port 25578");
});
