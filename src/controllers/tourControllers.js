const getAllTours = async (req, res) => {
  const result = await res.json({
    status: 200,
    message: 'Hello getAllTours',
  });
};

const createTour = async (req, res) => {
  const result = await res.json({
    status: 200,
    message: 'Hello createTour',
  });
};

const getSingleTour = async (req, res) => {
  const result = await res.json({
    status: 200,
    message: 'Hello getSingleTour',
  });
};

const deleteTour = async (req, res) => {
  const result = await res.json({
    status: 200,
    message: 'Hello deleteTour',
  });
};

const editTour = async (req, res) => {
  const result = await res.json({
    status: 200,
    message: 'Hello editTour',
  });
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  deleteTour,
  editTour,
};
