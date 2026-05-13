# H&M Trads Admin Dashboard - REST API Documentation

## Base URL
```
Production: https://api.hm-trads.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All endpoints (except `/auth/*`) require JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All responses follow a standard format:

### Success (200-299)
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error (400-599)
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {}
}
```

---

## Authentication Endpoints

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "Admin"
    }
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `429`: Too many login attempts

### POST /auth/logout
Logout and invalidate token.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/forgot-password
Request password reset link.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Laptop Endpoints

### GET /laptops
List all laptops with pagination and filtering.

**Query Parameters:**
```
page=1&pageSize=20
brand=Dell
processorBrand=Intel
priceMin=50000&priceMax=150000
stockStatus=In Stock
search=Core i7
sortBy=name&sortOrder=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dell Inspiron 15",
      "brand": "Dell",
      "sku": "SKU12345",
      "condition": "New",
      "purchasePrice": 50000,
      "sellingPrice": 65000,
      "currentQuantity": 10,
      "processor": {...},
      "ram": {...},
      "storage": {...},
      "gpu": {...},
      "display": {...},
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "pages": 5
  }
}
```

**Error Responses:**
- `400`: Invalid filter parameters
- `401`: Unauthorized

### GET /laptops/:id
Get laptop details by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dell Inspiron 15",
    "brand": "Dell",
    ...detailed laptop data
  }
}
```

**Error Responses:**
- `404`: Laptop not found

### POST /laptops
Create a new laptop (Admin/Manager only).

**Request:**
```json
{
  "name": "Dell Inspiron 15",
  "brand": "Dell",
  "modelNumber": "DL-5001",
  "serialNumber": "SN123456",
  "sku": "SKU12345",
  "barcode": "123456789012",
  "condition": "New",
  "processor": {
    "brand": "Intel",
    "category": "Core i7",
    ...
  },
  "purchasePrice": 50000,
  "sellingPrice": 65000,
  "currentQuantity": 10,
  ...
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...created laptop data
  },
  "message": "Laptop created successfully"
}
```

**Error Responses:**
- `400`: Validation error
- `403`: Insufficient permissions
- `409`: SKU/Barcode already exists

### PATCH /laptops/:id
Update laptop details (Admin/Manager only).

**Request:**
```json
{
  "currentQuantity": 15,
  "sellingPrice": 70000,
  "condition": "Refurbished"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {...updated laptop data},
  "message": "Laptop updated successfully"
}
```

### DELETE /laptops/:id
Delete laptop (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Laptop deleted successfully"
}
```

**Error Responses:**
- `403`: Insufficient permissions
- `409`: Laptop has associated orders

### POST /laptops/bulk/delete
Delete multiple laptops.

**Request:**
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "3 laptops deleted successfully"
}
```

---

## Customer Endpoints

### GET /customers
List all customers with pagination and filtering.

**Query Parameters:**
```
page=1&pageSize=20
type=B2B
search=Ahmed
purchaseAmountMin=100000
outstandingBalanceMin=0
sortBy=name&sortOrder=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ahmed Khan",
      "type": "B2B",
      "email": "ahmed@example.com",
      "phone": "+919876543210",
      "totalPurchases": 15,
      "totalAmount": 2500000,
      "outstandingBalance": 150000,
      "createdAt": "2024-01-10T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### GET /customers/:id
Get customer details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ahmed Khan",
    ...full customer details including orders history
  }
}
```

### POST /customers
Create a new customer.

**Request:**
```json
{
  "name": "Ahmed Khan",
  "type": "B2B",
  "email": "ahmed@example.com",
  "phone": "+919876543210",
  "address": "123 Business Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "companyName": "Khan Enterprises",
  "taxNumber": "TAX123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    ...created customer data
  },
  "message": "Customer created successfully"
}
```

### PATCH /customers/:id
Update customer details.

**Response (200):**
Similar to POST response.

### DELETE /customers/:id
Delete customer.

**Response (200):**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

---

## Order Endpoints

### GET /orders
List all orders with filtering.

**Query Parameters:**
```
page=1&pageSize=20
customerId=uuid
status=Delivered
paymentStatus=Paid
dateFrom=2024-01-01&dateTo=2024-12-31
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-100001",
      "customerId": "uuid",
      "status": "Delivered",
      "paymentStatus": "Paid",
      "total": 450000,
      "items": [
        {
          "laptopId": "uuid",
          "quantity": 2,
          "unitPrice": 225000,
          "subtotal": 450000,
          "discount": 0
        }
      ],
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### GET /orders/:id
Get order details with items.

**Response (200):**
Full order details with customer and laptop information.

### POST /orders
Create a new order.

**Request:**
```json
{
  "customerId": "uuid",
  "items": [
    {
      "laptopId": "uuid",
      "quantity": 2,
      "unitPrice": 225000,
      "discount": 0
    }
  ],
  "taxRate": 0.09,
  "shippingCost": 5000,
  "paymentMethod": "Bank Transfer",
  "shippingAddress": "123 Main Street, Mumbai"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-100001",
    ...created order data
  }
}
```

### PATCH /orders/:id
Update order status, payment status, etc.

**Request:**
```json
{
  "status": "Shipped",
  "paymentStatus": "Paid",
  "deliveryDate": "2024-02-15T10:30:00Z"
}
```

**Response (200):**
Updated order data.

### DELETE /orders/:id
Cancel order (only if status is Pending).

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Analytics Endpoints

### GET /analytics/dashboard
Get dashboard metrics and KPIs.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLaptops": 450,
    "totalChargers": 320,
    "totalCustomers": 285,
    "totalRevenue": 45000000,
    "totalProfit": 9000000,
    "totalOrders": 1250,
    "lowStockAlerts": 23,
    "dailyMetrics": [...],
    "topSellingProducts": [...],
    "brandDistribution": [...],
    "b2bVsB2c": {...}
  }
}
```

### GET /analytics/sales
Get sales analytics for date range.

**Query Parameters:**
```
startDate=2024-01-01
endDate=2024-12-31
groupBy=daily|weekly|monthly
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalSales": 45000000,
    "totalProfit": 9000000,
    "totalOrders": 1250,
    "avgOrderValue": 36000,
    "metrics": [...]
  }
}
```

### GET /analytics/top-products
Get top selling products.

**Query Parameters:**
```
limit=10
period=7days|30days|90days|1year
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "laptopId": "uuid",
      "name": "Dell Inspiron 15",
      "brand": "Dell",
      "totalQuantity": 245,
      "totalRevenue": 5612500
    }
  ]
}
```

---

## Charger Endpoints

### GET /chargers
List all chargers.

**Query Parameters:**
```
page=1&pageSize=20
type=Type-C
brand=Dell
stockStatus=Low Stock
```

### POST /chargers
Create a new charger.

### PATCH /chargers/:id
Update charger details.

### DELETE /chargers/:id
Delete charger.

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Authenticated**: 1000 requests per hour
- **Public**: 100 requests per hour
- **Header**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Pagination

Standard pagination format:
```json
{
  "page": 1,
  "pageSize": 20,
  "total": 285,
  "pages": 15
}
```

Default page size: 20
Max page size: 100

---

## Filtering & Sorting

**Filtering**: Use query parameters matching field names
```
?brand=Dell&condition=New&priceMin=50000
```

**Sorting**: 
```
?sortBy=name&sortOrder=asc  // or desc
```

---

## Webhooks (Future)

Subscribe to real-time events:
- `order.created`
- `order.updated`
- `inventory.low_stock`
- `payment.received`

---

## SDK/Client Libraries

- **JavaScript/TypeScript**: @hm-trads/sdk-js
- **Python**: hm-trads-sdk
- **Go**: github.com/hm-trads/sdk-go
