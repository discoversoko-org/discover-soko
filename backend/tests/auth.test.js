const test = require("node:test");
const assert = require("node:assert/strict");

const { validateOTP, validateRegistrationCompletion } = require("../src/modules/auth/auth.validation");

test("validateOTP rejects anything other than a 4-digit code", () => {
  assert.throws(() => validateOTP({ email: "user@example.com", code: "12345" }), /OTP must be 4 digits/);
});

test("validateRegistrationCompletion requires a password", () => {
  assert.throws(
    () =>
      validateRegistrationCompletion({
        firstName: "Jane",
        lastName: "Doe",
        countryCode: "+254",
        phoneNumber: "0712345678",
      }),
    /Password is required/
  );
});
