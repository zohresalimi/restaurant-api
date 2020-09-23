// handel unauthorized user 
const handleUnAuthorized = (res, message) =>{
    return res.status(401).json({ status : false, message});
}

// authenticat a user
const userAuthenticate = (req, res, next) => {
    const publicRoutes = [
        '/login',
        '/signup'
    ]
    const isPublicRout = publicRoutes.some(route => req.url.includes(route))
    console.log('isPublicRout: ' + isPublicRout)
    console.log(req.path === '/')
    if(req.path === '/' || isPublicRout){
        return next()
    }
    const authHeader = req.headers.authorization
    if(!authHeader){
        handleUnAuthorized(res,'Auth token is not supplied')
        return
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if(err){
            handleUnAuthorized(res,'Token is not valid')
            return
        }
        req.user = user;
        next()
    })
}

module.exports = { userAuthenticate }