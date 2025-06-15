const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false);
    }
  }
});

router.post('/', authenticate, upload.single('image'), journalController.createJournal);
router.get('/', authenticate, journalController.getJournals);
router.put('/:id', authenticate, upload.single('image'), journalController.updateJournal);
router.delete('/:id', authenticate, journalController.deleteJournal);

module.exports = router;