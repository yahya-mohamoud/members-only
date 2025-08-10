import { body, validationResult } from "express-validator";

const isAlphaErr = 'Name must be an alphabet'
const isLengthErr = 'Password must be 8 or greater'

export const  loginValidator = [
  
    
    body('username')
        .trim()
        .notEmpty()
        .withMessage("username can not be empty"),  
        
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

export const sigupValidator = [
   body('firstname')
        .trim()
        .notEmpty()
        .withMessage('firstname can not be empty.')
        .isAlpha()
        .withMessage('firstname must be an alphabet'),
    
    body("lastname")
        .trim()
        .notEmpty()
        .withMessage("lastname can not be empty")
        .isAlpha()
        .withMessage('lastname must be an alphabet'),

     body('username')
        .trim()
        .notEmpty()
        .withMessage("username can not be empty"),
        
    body('password')
        .trim()
        .notEmpty()
        .withMessage('password cann\'t be empty')
        .isLength({ min: 8})
        .withMessage(isLengthErr),
]
 export default {sigupValidator, loginValidator}