import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            console.log("No token provided.");
            return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        }

        console.log("Received Authorization Header:", token);

        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }

        console.log("Extracted Token:", token);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token in authMiddleware:", decoded);

        // Ensure role is present in token
        if (!decoded.role) {
            console.log("Decoded token does not contain a role");
            return res.status(403).json({ success: false, message: "Invalid token - role missing" });
        }

        req.user = decoded; // Store user data in request object
        next();

    } catch (error) {
        console.log("Token verification failed:", error.message);
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};

const adminMiddleware = (req, res, next) => {
    console.log("req.user in adminMiddleware:", req.user);

    if (!req.user) {
        console.log("Access Denied: req.user is undefined");
        return res.status(403).json({ success: false, message: "Access Denied. req.user is undefined." });
    }

    if (!req.user.role) {
        console.log("Access Denied: req.user.role is missing");
        return res.status(403).json({ success: false, message: "Access Denied. req.user.role is missing." });
    }

    if (req.user.role !== "admin") {
        console.log("Access Denied: User is not an admin.");
        return res.status(403).json({ success: false, message: "Access Denied. Admins only." });
    }

    console.log("Admin access granted.");
    next();
};

export { authMiddleware, adminMiddleware };
