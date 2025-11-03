const Joi = require('joi');

const createInvoiceSchema = Joi.object({
  clientName: Joi.string().min(1).max(255).required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().max(1000).optional(),
  dueDate: Joi.date().iso().greater('now').optional(),
  vatRateType: Joi.string().valid('standard', 'reduced', 'zero').optional()
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  validateRequest,
  createInvoiceSchema
};
