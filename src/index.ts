import express from "express";

import citiesRouter from "./routes/cities";
import departmentsRouter from "./routes/departments";
import regionsRouter from "./routes/regions";
import { getCities, getCitiesByRegion } from "./helpers/getters";

const app = express()
	.use(express.urlencoded({ extended: true }))
	.use(express.json())
	.use(citiesRouter)
	.use(departmentsRouter)
	.use(regionsRouter);

app.listen(25578, () => {
	console.log("Server started on port 25578");
});