const userProfile = (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user,
  });
};

module.exports = userProfile;