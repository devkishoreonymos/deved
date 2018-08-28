let moment = require('moment');
let crypto = require('crypto');

const encrypt = function (payload, session = 7) {
    const algorithm = 'HS256';
    const header = {
        type: 'JWT',
        algo: algorithm,
        iat: Number(moment().format('X')),
        exp: getExp(session)
    };

    let jwt = `${base64encoded(JSON.stringify(header))}.${base64encoded(JSON.stringify(payload))}.`;
    jwt += sign(jwt);
    return 'self ' + jwt;
};

const decrypt = function (req) {
    if (!req.headers.authorization) {
        throw new Error('Authorization header not present');
    } else {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('No Token found');
        }
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid Token Format');
        }
        const header = parts[0];
        const payload = parts[1];
        const tokenSign = parts[2];
        const signature = `${header}.${payload}.`;
        let jwt = sign(signature);

        if (isTokenExp(header)) {
            throw new Error('Token expired');
        }

        if (jwt === tokenSign) {
            return JSON.parse(base64decoded(payload));
        } else {
            throw new Error('Invalid Token');
        }
    }
};

function getExp(session) {
    return Number(moment().format('X')) + (Number(session) * 24 * 60 * 60);
}

function base64encoded(str) {
    return new Buffer(str).toString('base64');
}

function base64decoded(str) {
    return new Buffer(str, 'base64').toString();
}

function sign(str) {
    return crypto.createHmac('sha256', 'deved123').update(str).digest('base64');
}

function isTokenExp(header) {
    try {
        return (JSON.parse(base64decoded(header))).exp < Number(moment().format('X'));
    } catch (err) {
        throw new Error('Invalid token');
    }
}

module.exports = {encrypt, decrypt};
