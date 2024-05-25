import { Router } from "express";
import fs from "fs";

const router = Router();

router.use((req, res, next) => {
    // Analytics code here
    const path = req.path;
    const queries = Object.entries(req.query).map(([key, value]) => ({ key, value }));
    const timestamp = Date.now();
    
    if(!fs.existsSync("./dist/data/analytics.json")) {
        fs.writeFileSync("./dist/data/analytics.json", JSON.stringify([]));
        // fs.writeFileSync("./src/data/analytics.json", JSON.stringify([]));
    };

    const data = JSON.parse(fs.readFileSync("./dist/data/analytics.json").toString());
    data.push({ path, queries, timestamp });
    fs.writeFileSync("./dist/data/analytics.json", JSON.stringify(data));
    // fs.writeFileSync("./src/data/analytics.json", JSON.stringify(data));
    next();
});

export default router;