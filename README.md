# French Cities / Departments / Regions API
 Complete Dataset API of french Region/Department/Cities. More to come such as images, adresses etc

# URL
`http://185.44.81.189:25578/`

## Endpoints
- [Regions](#regions)
- [Departments](#departments)
- [Cities](#cities)

<!-- Global query parameter: fields, can be regions, departments & cities -->

### Query Parameters
| Name | Type | Description |
| --- | --- | --- |
| `fields` | `cities,departments,regions` | The fields to return, can be regions, departments & cities. No need to specify regions if you ask for /regions, same for departments and cities |
| `limit` | `int` | The number of results to return |
| `offset` | `int` | The number of results to skip |

### Regions
> **GET** `/regions`

#### Query Parameters :
| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | The name of the region |
| `slug` | `string` | The slug of the region |
| `departmentName` | `string` | The name of a department in the region |
| `departmentZip` | `string` | The zip code of a department in the region |
| `departmentStandardOfLivingMin` | `int` | The minimum standard of living of a department in the region |
| `departmentStandardOfLivingMax` | `int` | The maximum standard of living of a department in the region |
| `cityName` | `string` | The name of a city in the region |
| `citySlug` | `string` | The slug of a city in the region |
| `cityLat` | `float` | The latitude of a city in the region |
| `cityLon` | `float` | The longitude of a city in the region |
| `cityDistanceMin` | `int` | the minimum distance from cities to coordinates |
| `cityDistanceMax` | `int` | the maximum distance from cities to coordinates |
| `cityPopulationMin` | `int` | the minimum population of a city in the region |
| `cityPopulationMax` | `int` | the maximum population of a city in the region |
| `cityDensityMin` | `int` | the minimum density of a city in the region |
| `cityDensityMax` | `int` | the maximum density of a city in the region |

#### Example
```js
/* NODE JS */
const axios = require('axios').default;
axios.get("http://185.44.81.189:25578/regions", {
    params: {
        limit: 2,
        name: "ie"
    }
}).then(res => {
    console.log(res.data);
}).catch(err => {
    console.error(err);
});
```

#### Response
<details>
<summary>

</summary>

```json
{
  "success": true,
  "results": [
    {
      "name": "Normandie",
      "slug": "normandie",
      "departments": [
        "14",
        "27",
        "50",
        "61",
        "76"
      ],
      "departments": [{ // If you asked for departments field
        ...,
        "cities": { ... }, // If you asked for cities field
      }],
      "cities": { ... }, // If you asked for cities field only
    },
    {
      "name": "Occitanie",
      "slug": "occitanie",
      "departments": [
        "09",
        "11",
        "12",
        "30",
        "31",
        "32",
        "34",
        "46",
        "48",
        "65",
        "66",
        "81",
        "82"
      ],
      "departments": [{ // If you asked for departments field
        ...,
        "cities": { ... }, // If you asked for cities field
      }],
      "cities": { ... }, // If you asked for cities field only
    }
  ]
}
```
</details>


### Departments
> **GET** `/departments`

##### Query Parameters :
| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | The name of the department |
| `zip` | `string` | The zip code of the department |
| `standardOfLivingMin` | `int` | The minimum standard of living of the department |
| `standardOfLivingMax` | `int` | The maximum standard of living of the department |
| `regionName` | `string` | The name of the region of the department |
| `regionSlug` | `string` | The slug of the region of the department |
| `cityName` | `string` | The name of a city in the department |
| `citySlug` | `string` | The slug of a city in the department |
| `cityLat` | `float` | The latitude of a city in the department |
| `cityLon` | `float` | The longitude of a city in the department |
| `cityDistanceMin` | `int` | the minimum distance from cities to coordinates |
| `cityDistanceMax` | `int` | the maximum distance from cities to coordinates |
| `cityPopulationMin` | `int` | the minimum population of a city in the department |
| `cityPopulationMax` | `int` | the maximum population of a city in the department |
| `cityDensityMin` | `int` | the minimum density of a city in the department |
| `cityDensityMax` | `int` | the maximum density of a city in the department |

#### Example
```js
/* NODE JS */
const axios = require('axios').default;
axios.get("http://185.44.81.189:25578/departments", {
    params: {
        limit: 2,
        name: "ie"
    }
}).then(res => {
    console.log(res.data);
}).catch(err => {
    console.error(err);
});
```

#### Response
<details>
<summary>

</summary>

```json
{
  "success": true,
  "results": [
    {
      "name": "Savoie",
      "zip": "73",
      "standard_of_living": 24270,
      "region": { ... }, // If you asked for regions field
      "cities": [{ ... }] // If you asked for cities field
    },
    {
      "name": "Haute-Savoie",
      "zip": "74",
      "standard_of_living": 28120,
      "region": { ... }, // If you asked for regions field
      "cities": [{ ... }] // If you asked for cities field
    }
  ]
}
```
</details>


### Cities
> **GET** `/cities`

##### Query Parameters :
| Name | Type | Description |
| --- | --- | --- |
| `name` | `string` | The name of the city |
| `slug` | `string` | The slug of the city |
| `lat` | `float` | The latitude of the city |
| `lon` | `float` | The longitude of the city |
| `distanceMin` | `int` | the minimum distance from cities to coordinates |
| `distanceMax` | `int` | the maximum distance from cities to coordinates |
| `populationMin` | `int` | the minimum population of a city |
| `populationMax` | `int` | the maximum population of a city |
| `densityMin` | `int` | the minimum density of a city |
| `densityMax` | `int` | the maximum density of a city |
| `departmentName` | `string` | The name of the department of the city |
| `departmentZip` | `string` | The zip code of the department of the city |
| `departmentStandardOfLivingMin` | `int` | The minimum standard of living of the department of the city |
| `departmentStandardOfLivingMax` | `int` | The maximum standard of living of the department of the city |
| `regionName` | `string` | The name of the region of the city |
| `regionSlug` | `string` | The slug of the region of the city |

#### Example
```js
/* NODE JS */
const axios = require('axios').default;
axios.get("http://185.44.81.189:25578/cities", {
    params: {
        limit: 2,
        name: "Fécamp"
    }
}).then(res => {
    console.log(res.data);
}).catch(err => {
    console.error(err);
});
```

#### Response
<details>
<summary>

</summary>

```json
{
  "success": true,
  "results": [
    {
      "dep": "76",
      "name": "Fécamp",
      "slug": "fécamp",
      "region": "Normandie",
      "coord": {
        "lat": 49.7585718,
        "lon": 0.3758746
      },
      "population": 20808,
      "density": 1381,
      "museums": [
        {
          "name": "Musée des Arts & de l'Enfance",
          "address": "21, Rue Alexandre Legros 76400 FECAMP"
        },
        {
          "name": "Musée des Pêcheries, Cité des Terre-Neuvas",
          "address": "3, Quai Capitaine Jean Recher 76400 FECAMP"
        }
      ],
      "department": { ... }, // If you asked for departments field
      "region": { ... } // If you asked for regions field
    },
    {
      "dep": "76",
      "name": "Senneville-sur-Fécamp",
      "slug": "senneville-sur-fécamp",
      "region": "Normandie",
      "coord": {
        "lat": 49.7733929,
        "lon": 0.4149485
      },
      "population": 565,
      "density": 119,
      "museums": [],
      "department": { ... }, // If you asked for departments field
      "region": { ... } // If you asked for regions field
    }
  ]
}
```
</details>