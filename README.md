# francegeo-api
 Complete Dataset API of french Region/Department/Cities. More to come such as images, adresses etc

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

##### Query Parameters :
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