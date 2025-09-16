
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// cityMapping.json path
const mappingPath = path.join(__dirname, "cityMapping.json");
const cityMapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));

export const normalizeCity = (city)=>{
    if(!city) return ""
    const key = city.toLowerCase().trim()
    return cityMapping[key] || city 
}