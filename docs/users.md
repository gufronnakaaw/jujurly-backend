# Users API Spec

## Register Users API

Endpoint : /api/v1/users/register
<br />
Method : POST
<br />

Request Body :

```json
{
  "email": "usertest@mail.com",
  "fullname": "User Test",
  "password": "usertestpassword"
}
```

Response Body Success :
<br />
Status Code : 201

```json
{
  "success": true,
  "data": {
    "token": "token-value"
  }
}
```

Response Body Error :
<br />
Status Code : 400 (example client error)

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "email is required"
    },
    {
      "field": "fullname",
      "message": "fullname is required"
    },
    {
      "field": "password",
      "message": "password is required"
    }
  ]
}
```

## Login Users API

Endpoint : /api/v1/users/login
<br />
Method : POST
<br />

Request Body :

```json
{
  "email": "usertest@mail.com",
  "password": "usertestpassword"
}
```

Response Body Success :
<br />
Status Code : 200

```json
{
  "success": true,
  "data": {
    "token": "token-value"
  }
}
```

Response Body Error :
<br />
Status Code : 400 (example client error)

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "email is invalid"
    }
  ]
}
```
