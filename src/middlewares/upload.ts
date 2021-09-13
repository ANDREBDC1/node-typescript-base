import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import AppError from 'src/error/AppError'

const diretory = path.resolve(__dirname, '..', '..', 'tmp', 'upload')
const diretoryTmp = path.resolve(__dirname, '..', '..', 'tmp')
const uploadConfig = {

  local: multer.diskStorage({

    destination: diretoryTmp,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('HEX')
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName)
    }

  })

}

const upload = multer({
  storage: uploadConfig.local,
  limits: {
    fieldSize: 2 * 1024 * 1024
  },
  fileFilter: (request, file, cb) => {
    const allowerMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ]

    if (allowerMimes.includes(file.mimetype)) {
      return cb(null, true)
    } else {
      throw new AppError('Invalid file type')
    }
  }
})

export { upload, diretory, diretoryTmp }
