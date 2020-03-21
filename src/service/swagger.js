const router = require('express').Router();
const { logger, swagger } = require('../lib');

const getSwagger = async (req, res) => {
  try {
    res.status(200).json(swagger);
  } catch (e) {
    logger.error(`Exception in getSwagger :: Exception :: ${e}`);
    res.status(500).json({ error: e });
  }
};

router.route('/swagger').get(getSwagger);

module.exports = router;
