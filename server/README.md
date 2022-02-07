# forté API collection
This collection contains the API endpoints for 3YP - Remote Keyboard Tutor (**forté**)

## Register 

Used to register a student or a teacher in the database.

**URL for Student** : `<url>/student/register/`<br>
**URL for Student** : `<url>/tutor/register/`<br>
**Method** : `POST`<br>
**Auth required** : NO<br>

**Data constraints**

```json
{
    "firstName": "<first-name>",
    "lastName": "<las-name>",
    "email": "<valid-email>",
    "password": "<password>",
    "DOB": "<date-of-birth>",
    "phone": "<valid-phone-number>",
    "country": "<country>"
}
```

**Data example**

```json
{
    "firstName" : "Peter",
    "lastName" : "Quill",
    "email" : "guardians123@gmail.com",
    "password" : "rocket123",
    "DOB" : "12.06.1985",
    "phone" : "+94712394567",
    "country" : "Sri Lanka"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```
Student Registration Successful ✅
```

### Error Response

**Condition** : If required fields are not provided, input fields aren't in the proper range, email already exists in the system.

**Code** : `400 BAD REQUEST`

**Content** :

Errors vary with the conditions

Ex :
```
"firstName" is required
```
```
"lastName" is required
```
```
Email already exists
```

## Login

Used to collect a Token for a registered User (Student or Teacher).

**URL for Student** : `<url>/student/register/`<br>
**URL for Student** : `<url>/tutor/register/`<br>
**Method** : `POST`<br>
**Auth required** : NO<br>

**Data constraints**

```json
{
    "email": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "username": "guardians123@gmail.com",
    "password": "rocket123"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

Autherization token is sent along with the response for a login.

```
93144b288eb1fdccbe46d6fc0f241a51766ecd3d
```

### Error Response

**Condition** : If 'email' and 'password' combination is wrong.

**Code** : `400 BAD REQUEST`

**Content** :

```
Error 1 :
"email" must be a valid email
```
```
Error 2 :
email not found
```
```
Error 3 :
invalid password
```
## Get User Info

Used to collect basic information of a student or a tutor.

**URL for Student** : `<url>/student/info/:id`<br>
**URL for Student** : `<url>/tutor/info/:id`<br>
**Method** : `GET`<br>
**Auth required** : YES<br>

### Success Response

**Code** : `200 OK`

**Content example**

```
{
    "firstName": "Peter",
    "lastName": "Parker",
    "email": "spider123@gmail.com",
    "DOB": "1995-12-05T18:30:00.000Z",
    "country": "America"
}
```

### Error Response

**Condition** : If auth-token is not provided

**Code** : `400 BAD REQUEST`

**Content** :

```
Access Denied 🚫
```
