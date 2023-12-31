module.exports = (req, res, next) => {
  let query = req.query;
  let { limit, page } = query;
  delete query.limit;
  delete query.page;

  if (!page) page = 1;
  if (!limit) {
    limit = 10;
  }

  let skip = 0;
  limit = parseInt(limit);
  page = parseInt(page);
  if (page > 1) skip = (page - 1) * limit;

  req.query = {
    query,
    pagination: {
      page,
      limit,
      skip,
    },
  };

  next();
};
