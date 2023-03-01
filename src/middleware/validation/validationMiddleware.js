const { validationResult } = require("express-validator");
const { ValidationError } = require("../../utils/errors");

exports.validate = (schemas) => {
  return async (req, res, next) => {
    await Promise.all(schemas.map((schema) => schema.run(req))); //.run methoden körs på varje body i schemat o kollar/validerar vår req.body.

    const result = validationResult(req); //en till sak man måste köra föra att sedan fånga en array i result med resultatet av valideringen.
    if (result.isEmpty()) {
      //om denna array vi fick tillbaka är tom så har det inte blivit några valideringsfel.
      return next();
    }

    const errors = result.array(); //om arrayn ovan inte blev tom så kommer vi hit och då vill vi skicka ett felmedd inkl de felen i arrayn.
    const error = new ValidationError("Validation error", errors);
    return next(error);
  };
};
