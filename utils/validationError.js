class ValidationError extends Error {
  constructor(key, message) {
    super(message);

    this.errors = { [key]: { properties: { message } } };
  }
}

module.exports = ValidationError;
