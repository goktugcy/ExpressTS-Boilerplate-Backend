# ExpressTS Boilerplate

This project is a basic template built using Express.js and TypeScript. It includes the following features:

- Usage of Express.js
- Development with TypeScript
- Modular route structures
- Example of a basic auth service
- MongoDB integration

## Getting Started

These instructions will help you run the project on your local machine.

1. Clone the repository:

```bash
git clone https://github.com/goktugcy/ExpressTS-Boilerplate.git
```

```bash
Navigate to the project folder: cd ExpressTS-Boilerplate
```

Install the required dependencies:

```bash
npm install
```

Go to https://goktugceyhan.dev/playground or https://playcode.io/javascript and create a random value by pasting the code below. Then add this generated value to the SECRET_KEY field in your env file.
```javascript
 function generateSecureHexString(size) {
      const array = new Uint8Array(size / 2);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    const hexString = generateSecureHexString(45);
    console.log('Generated Secure Hex String:', hexString);
```
Start the project:

```bash
npm run dev
```

Open your browser and go to http://localhost:5002 to see the "Hello World" message.

## Routes and Authentication

This boilerplate provides a modular route structure and includes an example of basic authentication using middleware. Let's dive into the details:

### Route Structure

The route structure follows a modular pattern, which helps keep your code organized as your application grows. The `src/routes` directory contains individual route modules, each handling specific routes and their associated logic.

To define new routes or extend existing ones, you can create additional route modules in the `src/routes` directory and include them in the main `src/app.ts` file.

### Authentication

The example authentication system in this boilerplate demonstrates the basic flow of user registration, login, and protected routes using middleware.

1. **Registration**: The `/register` endpoint in `routes.ts` allows users to register by providing a username, email, and password. Passwords are hashed before being stored in the database.

2. **Login**: The `/login` endpoint in `routes.ts` handles user logins. It checks the provided credentials against the stored hashed password and issues a JSON Web Token (JWT) upon successful login.

3. **Protected Routes**: The boilerplate includes of a protected routes that requires authentication. The `authenticateMiddleware` middleware is applied to this route to ensure that only authenticated users can access it. If a user is not authenticated, they will receive a 401 Unauthorized response.

 
