# Job Offer Integration Backend

A NestJS backend application that integrates with two job offer APIs, transforms the data into a unified structure, stores it in a PostgreSQL database, and provides an API to retrieve and filter the data.

## Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL (running locally or via Docker)
- npm

## Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd job-offer-integration

---

### 2. Database Schema
- **Normalized database structure supporting unified job offer data**:  
  - ✅ Done: The `JobOffer` entity (`job-offers/entities/job-offer.entity.ts`) is normalized with a unique `id`, indexed fields (`title`, `location`), and nullable fields where appropriate (e.g., `minSalary`, `type`).
  - Uses PostgreSQL with TypeORM, optimized for queries with indexes.

---


# API Documentation

## Endpoint: `/api/job-offers`

### Method: GET
Retrieve a paginated list of job offers with optional filters.

### Query Parameters
| Parameter   | Type    | Description                          | Example            |
|-------------|---------|--------------------------------------|--------------------|
| `title`     | string  | Filter by job title (partial match)  | `title=Engineer`   |
| `location`  | string  | Filter by location (partial match)   | `location=New York`|
| `minSalary` | number  | Minimum salary filter                | `minSalary=50000`  |
| `maxSalary` | number  | Maximum salary filter                | `maxSalary=100000` |
| `page`      | number  | Page number (default: 1)             | `page=2`           |
| `limit`     | number  | Items per page (default: 10)         | `limit=5`          |

### Example Requests
1. **Basic request**:
   ```bash
   curl "http://localhost:3000/api/job-offers"