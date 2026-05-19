# Backend Pickleball

## Cong nghe su dung
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Joi
- Multer
- Bcrypt
- Helmet
- Express Rate Limit

## Cai dat

```bash
npm install
```

Tao file `.env` theo mau `.env.example`.

## Chay du an

```bash
npm run dev
```

Khi deploy:

```bash
npm start
```

## API chinh

User
- POST /api/users/register
- POST /api/users/login
- POST /api/users/refresh-token
- GET /api/users/profile
- PUT /api/users/profile
- PUT /api/users/avatar

Product
- GET /api/products
- GET /api/products/search
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

Order
- POST /api/orders
- POST /api/orders/from-cart
- GET /api/orders/my-orders
- GET /api/orders
