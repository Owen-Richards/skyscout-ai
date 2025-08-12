import { __awaiter } from "tslib";
import { jwtVerify } from 'jose';
import { config } from '../config';
export function verifyJWT(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = new TextEncoder().encode(config.JWT_SECRET);
        try {
            const { payload } = yield jwtVerify(token, secret);
            return payload;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    });
}
