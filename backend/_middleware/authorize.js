const jwt = require('jsonwebtoken');
const config = require('../config.json'); // Ensure this points to your secret

module.exports = function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        async (req, res, next) => {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const token = authHeader.split(' ')[1];

            try {
                console.log('Authorization Header:', req.headers.authorization);
                const decoded = jwt.verify(token, config.secret);
                console.log('Decoded Token:', decoded); // Debugging log
                req.user = decoded;

                // Check if the user has the required role
                if (roles.length && !roles.includes(req.user.role)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                next();
            } catch (err) {
                console.error('JWT Verification Error:', err); // Debugging log
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
    ];
};