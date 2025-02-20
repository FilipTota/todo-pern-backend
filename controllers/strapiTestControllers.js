const STRAPI_URL = process.env.STRAPI_API_URL;

// Route for reading posts, accessible by everyone
// @desc    Get all tests
// @route   GET /api/tests
export const getTests = async (req, res) => {
  const response = await fetch(`${STRAPI_URL}/api/tests`, {
    headers: {
      Authorization: `Bearer ${req.strapiAccessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return res.status(403).json({ message: "Access denied" });
  }

  const data = await response.json();
  res.json(data);
};

// Route for reading posts, accessible only for admins
// @desc    Create test
// @route   POST /api/tests
export const createTest = async (req, res) => {
  const response = await fetch(`${STRAPI_URL}/api/tests`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.strapiAccessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  res.json(data);
};
