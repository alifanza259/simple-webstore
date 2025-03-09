# Simple Webstore

## Backend:

### Setup local: 

1. Run `cd backend`
2. Run `npm install`
3. Run `docker compose up -d`
4. Setup `.env` with content:
```
GA_API_SECRET=
GA_MEASUREMENT_ID=
APP_URL=localhost:3002
DB_HOST=localhost
DB_PORT=5436
DB_USER=postgres
DB_PASS=mysecretpassword
DB_NAME=postgres
```
5. Run `npm run migrate && npm start`
5. Server is running on `localhost:3002`

### List Endpoints:

- `GET /products` : Get products
- `GET /product/:id` : Get product by id
- `POST /products` : Create product
- `PATCH /product/:id` : Update certain product
- `DELETE /product/:id` : Delete certain product
- `POST /import-products` : Import products from external resource (API `https://fakestoreapi.com/products`)
- `PATCH /product/:id/adjust-stock` : Update certain product's stock
- `GET /product/stock-logs` : Get recent stock changes from products

<hr />

## Frontend:

### Setup local: 

1. Run `cd frontend`
2. Run `npm install`
3. Setup .env with content:
```
APP_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_GTM_ID=
```
4. Run `npm run dev`
4. Access `localhost:3000` in browser and start testing

### List Pages:

- `/admin/products`: Admin Product Management Page
- `/admin/stocks`: Admin Stock Management Page
- `/`: Storefront Home Page
- `/cart`: Storefront Cart Page
- `/product/:id`: Storefront Product Detail Page

<hr />



## Achieved ToDos :

#### Core Requirements (Backend):

- Use Raw SQL Queries with no ORM/query builders 
- Choose either PostgreSQL, MySQL, or SQLite
- Use migration tool like knex.js
- Write raw SQL queries in the up and down functions
- Product CRUD Operations with Raw SQL
- Bulk Import Products, fetch data from API and insert into database with Raw SQL to avoid duplicates
- Stock Adjustment via Delta with raw SQL query
- Sanitize inputs to prevent SQL injection via use parameterized queries
- Google Analytics Integration on :
  - Product creation/update/deletion (admin actions)
  - Stock adjustments

#### Bonus Requirements (Backend):

- Unit tests in few endpoint processes using Jest: Created 2 unit test samples using jest, expecting program return success/ throw error according to data supplied. Supplied data coming from external source such as database is stubbed.
- Efficient SQL queries: Added Indexes and Use single insert with multiples values on bulk insert
- Proper error handling: Handle with try catch and return statusCode according to error message



### Core Requirements (Frontend):

- Use Next.js 14+ with App Router
- Use functional components with react hooks
- Implement SSR and SSG where applicable
- Use shadcn/ui for building front end components, and customize theme to match storefront aesthetic
- Create admin panel for product management:
  - With form to create/edit products which integrated to backend
  - Table displaying products with search, category filter, and pagination
  - Delete button with confirmation
- Create admin panel for stock adjustment:
  - With input field to select which product's stock will be adjusted by applying delta values
  - Display log of recent stock changes
- Create storefront panel:
  - With home page using infinite scroll implementation and search & category filter feature
  - Shopping Cart page listing all products added to the cart (persisted in localStorage, with context to refresh client component when there's update), able to add/remove cart items, and showing total price
- GTM & Google Analytics Integration:
  - Fire events when user views a product (in this case opening product detail page)
  - Fire events when user adding product to cart
  - Fire events when user checks out

### Bonus Requirements (Frontend):

- Achieved responsive degree to some degree (there's a page which is not responsive)
- Loading states when calling API
- Using toast to show success/error result

### Extras: 

- Deployed backend on Railway: https://simple-webstore-production.up.railway.app
- Deployed frontend on Vercel: https://simple-webstore-89m9.vercel.app/



## Demo Screenshots:

Admin Page

- https://drive.google.com/file/d/1hI4NIByINF0cdMQBBI03WlWRrfMF7WPA/view?usp=drive_link

- https://drive.google.com/file/d/1KkcIsHFcNH8oNdbe-jKYuR9Xtsx_wwKY/view?usp=drive_link
- https://drive.google.com/file/d/1S4veZPeLswNcYa9V9WS1MJX60eHoxN7W/view?usp=drive_link

- https://drive.google.com/file/d/1yM-4u2Est65WI8HaW0S6ak-Jg2iBg8Kh/view?usp=drive_link

  

- https://drive.google.com/file/d/1iwnQUgEpVcPpB7J45uoq-TEoVKd_FsYE/view?usp=drive_link

- https://drive.google.com/file/d/1fNpwu653-L2ALw-mMTyCxgqMC62FbsSV/view?usp=drive_link



Storefront Page

- https://drive.google.com/file/d/1v1SojXoTHYzpVL6FY4jDwZF-Z65mxC60/view?usp=drive_link

- https://drive.google.com/file/d/1TmbgdUiRD3S3yJkIQhNgxmFNR11srPw4/view?usp=drive_link
- https://drive.google.com/file/d/1xqoMDMFsleWeMIc2PS96HxV20HazU-il/view?usp=drive_link

- https://drive.google.com/file/d/1h0y_JCBTtwZfWj-l2XfG9t04LEBXWZX2/view?usp=drive_link



Google Analytics Result

- https://drive.google.com/file/d/1bASb4Cp3paMTQ8lCqUwRhkfzBE0QJzr5/view?usp=drive_link