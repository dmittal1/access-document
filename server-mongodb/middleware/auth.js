import jwt from 'jsonwebtoken';

function Auth(req, res, next){
    const token = req.header('auth-token');

    try{
        const verified = jwt.verify(token, 'eqr3r3rd2');
        req.user = verified;
        next();
    } catch(err){
        res.status(400).send('Invalid Token');
    }
};

export default Auth;