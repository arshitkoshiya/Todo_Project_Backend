const { body, validationResult } = require('express-validator');


const validationData = [ body('CountryName',"The 'CountryName' field is required and must have a length of at least 2 characters.").isLength({min:2})
 ,(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
          next();

    }catch (err) {
        res.status(500).json({ error: "Internal Server error" });
    }
}];

module.exports = validationData