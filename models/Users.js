const bcrypt = require('../node_modules/bcryptjs')
const saltRounds = 16;


let exportedMethods = {
    async hashPassword(password) {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            return hash;
        } catch (err) {
            throw err
        }
    },

    async compareHash(password, hash) {
        try {
            if (password && hash) {
                const pass = await bcrypt.compare(password, hash)
                return pass
            }
        } catch (err) {
            throw err
        }
    }
}

module.exports = exportedMethods;
