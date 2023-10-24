
// Store login attempts and their timestamps
const loginAttempts = new Map();

// Maximum number of allowed login attempts
const maxLoginAttempts = 3;

// Delay (in milliseconds) before allowing further login attempts after exceeding maxLoginAttempts
const loginDelay = 60000; 

const checkAttempts = (req, res, next) => {
    const { username } = req.body;
    const now = Date.now();
    try {
        if (loginAttempts.has(username) && loginAttempts.get(username).attempts >= maxLoginAttempts) {
            const lastAttemptTime = loginAttempts.get(username).timestamp;
            const timeSinceLastAttempt = now - lastAttemptTime;

            if (timeSinceLastAttempt < loginDelay) {
                // Too many login attempts within the delay period
                const remainingTime = loginDelay - timeSinceLastAttempt;
                return res.json({
                    result:"Too many attempts",
                    error: `Too many login attempts. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`,
                    retryAfter: Math.ceil(remainingTime / 1000)
                });
            } else {
                // Reset the login attempts counter
                loginAttempts.delete(username);
            }
        }
        next()
    } catch {
        res.json({ error: "Internal Server error" });

    }
}

module.exports = checkAttempts