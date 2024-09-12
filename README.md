# Customer Anonymizer Service

This service monitors a MongoDB collection for customer data, anonymizes sensitive fields, and stores the anonymized data in a separate collection.

## Prerequisites

- Node.js v20.15.1
- MongoDB (installed and running)

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd customer-anonymizer
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string. See .env.example file

   ```

   ```

## Building the Application

To build the TypeScript code, run:

```
yarn run build
```

This will compile the TypeScript files and output the JavaScript files in the `dist` directory.

## Running the Application

To start the service, run:

```
yarn start
```

For development with auto-reloading, use:

```
yarn run dev
```

The service will connect to the MongoDB database specified in the `DB_URI` environment variable. It will then start generating fake customer data and inserting it into the `customers` collection. The service will also watch for changes in the `customers` collection and create anonymized versions of the documents in the `customers_anonymised` collection.

## Project Structure

- `src/server.ts`: Main application file that sets up the MongoDB connection, change stream, and customer generation.
- `src/anonymizer.ts`: Contains the logic for anonymizing customer data.
- `src/interfaces/customer.d.ts`: Defines the Customer TypeScript interfaces used in the project.
