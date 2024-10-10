// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./database.js";

// function getUserData(id) {
//   const dbs = {
//     db1: db1,
//     db2: db2,
//     db3: db3
//   };
// }

async function getUserData(id) {
  try {
    if (typeof id !== "number" || id < 1 || id > 10) {
      throw new Error("Invalid Input -- ID must be a number between 1 and 10.");
    }

    // Determine the database to use based on the id
    const dbName = await central(id);
    const dbs = { db1: db1, db2: db2, db3: db3 };

    // Fetch user data from the relevant database and the vault in parallel
    const [basicData, vaultData] = await Promise.all([dbs[dbName](id), vault(id)]);

    // Combine the data into the required object structure
    const combinedData = {
      id: id,
      name: vaultData.name,
      username: basicData.username,
      email: vaultData.email,
      address: {
        street: vaultData.address.street,
        suite: vaultData.address.suite,
        city: vaultData.address.city,
        zipcode: vaultData.address.zipcode,
        geo: vaultData.address.geo,
      },
      phone: vaultData.phone,
      website: basicData.website,
      company: basicData.company,
    };

    return combinedData;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return Promise.reject(`Error fetching data: ${error.message}`);
  }
}

// Example usage
getUserData(3)
  .then(userData => console.log("User Data:", userData))
  .catch(error => console.error("Error:", error));
