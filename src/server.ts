import { faker } from "@faker-js/faker";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { anonymizeCustomer } from "./anonymizer";
import { Customer } from "./interfaces/customer";
import { CUSTOMERS_MAX_COUNT } from "./static/constants";

const dbUri = process.env.DB_URI;
if (!dbUri) {
  throw new Error("DB_URI is not defined in .env file");
}

const client = new MongoClient(dbUri);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const customersCollection: Collection<Customer> =
      db.collection("customers");
    const anonymizedCollection: Collection<Customer> = db.collection(
      "customers_anonymised",
    );

    await customersCollection.createIndex({ email: 1 }, { unique: true });
    await anonymizedCollection.createIndex({ email: 1 }, { unique: true });

    const changeStream = customersCollection.watch();
    changeStream.on("change", async (change) => {
      if (
        change.operationType === "insert" ||
        change.operationType === "update"
      ) {
        const customer = change.fullDocument as Customer;
        const anonymizedCustomer = anonymizeCustomer(customer);
        const { _id, ...fieldsToUpdate } = anonymizedCustomer;
        await anonymizedCollection.updateOne(
          { _id: customer._id },
          { $set: fieldsToUpdate },
          { upsert: true },
        );
      }
    });

    setInterval(async () => {
      const customersRandomAmount =
        Math.floor(Math.random() * CUSTOMERS_MAX_COUNT) + 1;
      const customers: Customer[] = [];

      for (let i = 0; i < customersRandomAmount; i++) {
        const customer: Customer = {
          _id: new ObjectId(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          address: {
            line1: faker.location.streetAddress(),
            line2: faker.location.secondaryAddress(),
            postcode: faker.location.zipCode(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
          },
          createdAt: new Date(),
        };
        customers.push(customer);
      }

      try {
        await customersCollection.insertMany(customers);
        console.log(`Inserted ${customersRandomAmount} customers`);
      } catch (error) {
        console.error("Error inserting customers:", error);
      }
    }, 200);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
