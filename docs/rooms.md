# Rooms API Spec

## Create Rooms API

Endpoint : /api/v1/rooms
<br />
Method : POST
<br />
Headers :

- Authorization : Bearer (token)
  <br />

Request Body :

```json
{
  "name": "Room Test",
  "start": 1690776168631,
  "end": 1690776168631,
  "candidates": [
    {
      "name": "Candidate 1"
    },
    {
      "name": "Candidate 2"
    }
  ]
}
```

Response Body Success :
<br />
Status Code : 201

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Room Test",
    "start": 1690776168631,
    "end": 1690776168631,
    "code": "VBGHLKJI",
    "candidates": [
      {
        "name": "Candidate 1"
      },
      {
        "name": "Candidate 2"
      }
    ]
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
      "field": "name",
      "message": "name is required"
    },
    {
      "field": "start",
      "message": "start must be unix timestamp"
    },
    {
      "field": "end",
      "message": "end must be unix timestamp"
    }
  ]
}
```

## Get Rooms API

Endpoint : /api/v1/rooms
<br />
Method : GET
<br />
Headers :

- Authorization : Bearer (token)
  <br />

Response Body Success :
<br />
Status Code : 200

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pemilihan Ketua RT",
      "start": 1690776168631,
      "end": 1690776168631,
      "code": "VBGHLKJI"
    },
    {
      "id": 2,
      "name": "Pemilihan Ketua OSIS",
      "start": 1690776168631,
      "end": 1690776168631,
      "code": "HGUYBVXZ"
    },
    {
      "id": 3,
      "name": "Pemilihan Ketua Partai Nasdem",
      "start": 1690776168631,
      "end": 1690776168631,
      "code": "QWEVXPOI"
    }
  ]
}
```

Response Body Error :
<br />
Status Code : 401

```json
{
  "success": false,
  "errors": [
    {
      "message": "Unauthorized"
    }
  ]
}
```

## Get Rooms By Code API

Endpoint : /api/v1/rooms
<br />
Method : GET
<br />
Headers :

- Authorization : Bearer (token)
  <br />

Query String :

- code

Response Body Success :
<br />
Status Code : 200

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Room Test",
    "start": 1690776168631,
    "end": 1690776168631,
    "code": "BGHIWAXL",
    "total_votes": 4,
    "candidates": [
      {
        "id": 1,
        "name": "Candidate 1",
        "percentage": 75,
        "vote_count": 3
      },
      {
        "id": 2,
        "name": "Candidate 2",
        "percentage": 25,
        "vote_count": 1
      }
    ]
  }
}
```

Response Body Error :
<br />
Status Code : 404

```json
{
  "success": false,
  "errors": [
    {
      "message": "Room not found"
    }
  ]
}
```

## Get Rooms By Id API

Endpoint : /api/v1/rooms
<br />
Method : GET
<br />
Headers :

- Authorization : Bearer (token)
  <br />

Query String :

- id

Response Body Success :
<br />
Status Code : 200

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Room Test",
    "start": 1690776168631,
    "end": 1690776168631,
    "code": "BGHIWAXL",
    "candidates": [
      {
        "name": "Candidate 1"
      },
      {
        "name": "Candidate 2"
      }
    ]
  }
}
```

Response Body Error :
<br />
Status Code : 404

```json
{
  "success": false,
  "errors": [
    {
      "message": "Room not found"
    }
  ]
}
```

## Update Rooms API

Endpoint : /api/v1/rooms
<br />
Method : PATCH
<br />
Headers :

- Authorization : Bearer (token)
  <br />

Request Body :

```json
{
  "room_id": 1,
  "name": "Update Room Test",
  "start": 1690776168631,
  "end": 1690776168631,
  "code": "BGHIWAXL",
  "candidates": [
    {
      "name": "Update Candidate 1"
    },
    {
      "name": "Update Candidate 2"
    }
  ]
}
```

Response Body Success :
<br />
Status Code : 200

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Room Test",
    "start": 1690776168631,
    "end": 1690776168631,
    "code": "HJBGWTYU",
    "candidates": [
      {
        "name": "Update Candidate 1"
      },
      {
        "name": "Update Candidate 2"
      }
    ]
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
      "field": "name",
      "message": "name is required"
    },
    {
      "field": "start",
      "message": "start must be unix timestamp"
    },
    {
      "field": "end",
      "message": "password must be unix timestamp"
    }
  ]
}
```

## Delete Rooms API

Endpoint : /api/v1/rooms
<br />
Method : DELETE
<br />
Headers :

- Authorization : Bearer (token)
  <br />

Request Body :

```json
{
  "room_id": 1,
  "code": "HJBGWTYU"
}
```

Response Body Success :
<br />
Status Code : 200

```json
{
  "success": true,
  "data": {
    "message": "Delete room successfully"
  }
}
```

Response Body Error :
<br />
Status Code : 404

```json
{
  "success": false,
  "errors": [
    {
      "message": "Room not found"
    }
  ]
}
```

## Create Votes API

Endpoint : /api/v1/rooms/votes
<br />
Method : POST
<br />
Headers :

- Authorization : Bearer (token)
  <br />

Request Body :

```json
{
  "room_id": 1,
  "code": "CHVBFUTY",
  "candidate": {
    "id": 2
  }
}
```

Response Body Success :
<br />
Status Code : 201

```json
{
  "success": true,
  "data": {
    "message": "Vote candidate successfully"
  }
}
```

Response Body Error :
<br />
Status Code : 401

```json
{
  "success": false,
  "errors": [
    {
      "message": "Unauthorized"
    }
  ]
}
```
