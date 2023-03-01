exports.getAllGyms = async (req, res) => {
  try {
    return res.send("Getallgyms");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getGymById = async (req, res) => {
  try {
    return res.send("getGymById");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.createGym = async (req, res) => {
  try {
    return res.send("createGym");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGymById = async (req, res) => {
  try {
    return res.send("updateGymById");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteGymById = async (req, res) => {
  try {
    return res.send("deleteGymById");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
