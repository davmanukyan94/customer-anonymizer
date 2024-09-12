import crypto from "crypto";
import { Customer } from "./interfaces/customer";
import { ALPHABET, PSEUDO_RANDOM_STRING_LENGTH } from "./static/constants";

function generatePseudoRandomString(input: string): string {
  const hash = crypto.createHash("sha256").update(input).digest();
  let pseudoRandomString = "";
  for (let i = 0; i < PSEUDO_RANDOM_STRING_LENGTH; i++) {
    const index = hash[i] % ALPHABET.length;
    pseudoRandomString += ALPHABET[index];
  }

  return pseudoRandomString;
}

export function anonymizeCustomer(customer: Customer): Customer {
  const [firstPartOfEmail, secondPartOfEmail] = customer.email.split("@");
  customer.firstName = generatePseudoRandomString(customer.firstName);
  customer.lastName = generatePseudoRandomString(customer.lastName);
  customer.email = `${generatePseudoRandomString(
    firstPartOfEmail,
  )}@${secondPartOfEmail}`;
  customer.address.line1 = generatePseudoRandomString(customer.address.line1);
  customer.address.line2 = generatePseudoRandomString(customer.address.line2);
  customer.address.postcode = generatePseudoRandomString(
    customer.address.postcode,
  );

  return customer;
}
