const STATUS_CODE = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER: 500,
  OK: 200,
  CREATED: 201
}

const REASON_STATUS_CODE = {
  FORBIDDEN: 'Bad request error',
  CONFLICT: 'Conflict error',
  NOT_FOUND: 'Not found error',
  UNAUTHORIZED: 'Unauthorized error',
  BAD_REQUEST: 'Bad request error',
  INTERNAL_SERVER: 'Internal server error',
  CREATED: 'Created',
  SUCCESS: 'Success'
}

const ROLE_SHOP = {
  ADMIN: 'admin',
  USER: 'user',
  SHOP: 'shop',
  WRITER: 'writer',
  EDITOR: 'editor'
}

const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
}

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id'
}

const PRODUCT_TYPE = {
  ELECTRONICS: 'Electronics',
  CLOTHING: 'Clothing',
  FURNITURE: 'Furniture'
}

module.exports = {
  ROLE_SHOP,
  STATUS,
  HEADER,
  STATUS_CODE,
  REASON_STATUS_CODE,
  PRODUCT_TYPE
}
