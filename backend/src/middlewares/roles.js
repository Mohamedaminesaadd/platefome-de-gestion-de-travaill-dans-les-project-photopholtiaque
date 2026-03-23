// Un seul endroit pour définir tous les rôles → plus de magic strings
export const ROLES = {
  ADMIN:           'admin',
  DIRECTOR:        'director',
  TECHNICIAN:      'technician',
  PROJECT_MANAGER: 'project_manager',
};

// Accepte un ou plusieurs rôles autorisés
export const verifyRole = (...rolesRequired) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const hasRole = rolesRequired.includes(req.user.role);

    if (!hasRole) {
      // Log d'audit : qui a tenté quoi
      console.warn(
        `⛔ Access denied — user: ${req.user.id}, role: ${req.user.role}, required: [${rolesRequired.join(', ')}]`
      );
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};