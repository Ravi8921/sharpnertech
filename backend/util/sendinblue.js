const SibApiV3Sdk = require("sib-api-v3-sdk");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Sendinblue API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key']; // Correct authentication method
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = apiInstance;
