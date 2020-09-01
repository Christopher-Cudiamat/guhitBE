const router = require('express-promise-router')();
const CreatorsController = require('../../controllers/creators');


//@route   GET api/creators/list
//@desc    get all creator's lists
//@access  Public
router.get(
  '/lists',
  CreatorsController.getCreatorsList
);

//@route   GET api/creators/creator
//@desc    get one creator
//@access  Public
router.get(
  '/',
  CreatorsController.getCreator
);

module.exports = router;