import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type Source = "body" | "params" | "query";

const validate =
  (schema: ZodType, source: Source = "body"): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    // trimmed, typed, defaults applied, unknown keys removed.
    // Express 5 makes req.query read-only, so plain assignment would throw.
    Object.defineProperty(req, source, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };

export default validate;
