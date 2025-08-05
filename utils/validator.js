import { body, validationResult } from "express-validator";

const isAlphaErr = 'Name must be an alphabet'
const isLengthErr = 'Password must be 8 or greater'

const validateUser = [
    // body('firstname')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('name can not be empty.')
    //     .isAlpha()
    //     .withMessage(isAlphaErr),
    
    // body("lastname")
    //     .trim()
    //     .notEmpty()
    //     .withMessage("name can not be empty")
    //     .isAlpha()
    //     .withMessage(isAlphaErr),
    
    body('username')
        .trim()
        .notEmpty()
        .withMessage("username can not be empty")
        .isAlpha()
        .withMessage(isAlphaErr), 
        
    body('password')
        .trim()
        .notEmpty()
        .withMessage('password cann\'t be empty')
        .isLength({ min: 8})
        .withMessage(isLengthErr),

    // body('confirm')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('password cann\'t be empty')
    //     .isLength({ min: 8})
    //     .withMessage(isLengthErr)
]

export default validateUser