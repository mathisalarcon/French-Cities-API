# francegeo-api
 Complete Dataset API of french Region/Department/Cities. More to come such as images, adresses etc

## Endpoints
- [Regions](#regions)
- [Departments](#departments)
- [Cities](#cities)

### Regions
- **GET** `/regions` : Get all regions
- **GET** `/regions/{id}` : Get region by id

### Departments
- **GET** `/departments` : Get all departments
- **GET** `/departments/{id}` : Get department by id

### Cities
- **GET** `/cities` : Get all cities
- **GET** `/cities/{id}` : Get city by id
- **GET** `/cities/department/{id}` : Get cities by department id