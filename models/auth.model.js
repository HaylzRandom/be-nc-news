// Authentication model

// Create User

/*
    - Check all required fields are present
    - Encrypt password
    - Check if user already exists -> if does, send info back
    - Ensure that email is unique
    - Create User in DB
    - Call Login User function
*/

// Login User

/*
    - Check email and password fields are present
    - Fetch encrypted password from database
    - Decrypt encrypted password and check if matches password passed in
    - Update login time on DB for user
    - Create / Update JWT
*/

// Delete User

/*
    - Check user is own user / admin user
    - Delete User from database
*/