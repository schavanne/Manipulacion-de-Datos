const {check} = require('express-validator')

module.exports = [

    check('title')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min : 2
        }).withMessage('Cómo mínimo 2 caracteres'),

    check('rating')
        .notEmpty().withMessage('El numero es obligatorio').bail()
        .isNumeric({
            no_symbols : true,
        }).withMessage('Debe ser un número entero positivo'),

    check('length')
        .notEmpty().withMessage('La longitud es obligatorio').bail()
        .isNumeric({
            no_symbols : true,
        }).withMessage('La longitud debe ser un numero entero'),
    
    check('awards')
        .notEmpty().withMessage('El numero es obligatorio').bail()
        .isNumeric({
            no_symbols : true,
        }).withMessage('Debe un número entero positivo'),    

    check('release_date')
        .notEmpty().withMessage('La fecha es obligatoria')
]