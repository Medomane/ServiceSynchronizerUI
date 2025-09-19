const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateTaskId = [
  param('id').isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  handleValidationErrors
];

const validateCreateTask = [
  body('query')
    .notEmpty()
    .withMessage('Query is required')
    .isLength({ max: 2147483647 })
    .withMessage('Query is too long'),
  body('destinationTableName')
    .notEmpty()
    .withMessage('Destination table name is required')
    .isLength({ max: 255 })
    .withMessage('Destination table name is too long'),
  body('isEnabled')
    .isBoolean()
    .withMessage('IsEnabled must be a boolean value'),
  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isLength({ max: 10 })
    .withMessage('Frequency is too long'),
  body('dayValue')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const num = parseInt(value);
      return !isNaN(num) && num >= 1 && num <= 31;
    })
    .withMessage('Day value must be between 1 and 31'),
  body('batchSize')
    .isInt({ min: 1 })
    .withMessage('Batch size must be a positive integer'),
  handleValidationErrors
];

const validateUpdateTask = [
  body('query')
    .optional()
    .isLength({ max: 2147483647 })
    .withMessage('Query is too long'),
  body('destinationTableName')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Destination table name is too long'),
  body('isEnabled')
    .optional()
    .isBoolean()
    .withMessage('IsEnabled must be a boolean value'),
  body('frequency')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Frequency is too long'),
  body('dayValue')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      const num = parseInt(value);
      return !isNaN(num) && num >= 1 && num <= 31;
    })
    .withMessage('Day value must be between 1 and 31'),
  body('batchSize')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Batch size must be a positive integer'),
  handleValidationErrors
];

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  handleValidationErrors
};
