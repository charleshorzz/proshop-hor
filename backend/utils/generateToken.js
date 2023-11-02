import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    //Create Token
    const token = jwt.sign({ userId } , process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    //Send the token to a cookie on the server (HTTP-Only Cookie)
    res.cookie('jwt', token, {
        httpOnly: true,
        //Provide https
        secure: process.env.NODE_ENV !== 'development',
        //Links from other source will not get cookie
        sameSite: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
    })
}

export default generateToken;