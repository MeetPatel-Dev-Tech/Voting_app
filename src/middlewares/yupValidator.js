module.exports =
  (schema, type = "body") =>
  async (req, res, next) => {
    try {
      const dataToValidate = req[type];
      const validatedData = await schema.validate(dataToValidate, {
        abortEarly: false, // show all errors, not just first
        stripUnknown: true, // remove extra fields not in schema
      });

      req[type] = validatedData; // replace with validated + sanitized data
      next();
    } catch (error) {
      return res.status(400).json({
        status: "fail",
        errors: error.inner.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
  };
