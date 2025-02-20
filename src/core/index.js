import fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'
import { generateUUID } from '../utils/uuid.js'
import { checkType } from '../utils/typeCheck.js'

export class CoreService {
  constructor() {
    this.currentDir = process.cwd()
  }

  async upload(req) {
    return new Promise((resolve, reject) => {
      const uploadDir = path.join(this.currentDir, 'uploads')

      fsPromises
        .mkdir(uploadDir, { recursive: true })
        .then(() => {
          const fileId = generateUUID()
          const filePath = path.join(uploadDir, `${fileId}.iso`)
          const writeStream = fs.createWriteStream(filePath)

          let isFileData = false

          req.once('data', async (chunk) => {
            const chunkStr = chunk.toString()

            try {
              const isValid = await checkType('.iso', chunkStr)

              if (!isValid) {
                req.destroy()
                writeStream.destroy()

                return reject({
                  ok: false,
                  error: 'Invalid file format. Only .iso files are allowed.'
                })
              }
            } catch (err) {
              req.destroy()
              writeStream.destroy()

              return reject({ ok: false, error: 'File type validation error' })
            }

            const fileStart = chunk.indexOf('\r\n\r\n') + 4
            if (fileStart > 3) {
              chunk = chunk.slice(fileStart)
              isFileData = true
            }

            if (isFileData) {
              writeStream.write(chunk)
            }

            req.on('data', (chunk) => {
              if (isFileData) {
                if (!writeStream.write(chunk)) {
                  req.pause()
                  writeStream.once('drain', () => req.resume())
                }
              }
            })

            req.on('end', () => {
              writeStream.end()
            })
          })

          writeStream.on('finish', async () => {
            resolve({
              ok: true,
              message: 'File uploaded successfully!',
              downloadUrl: `http://localhost:3000/download/${path.basename(filePath)}`
            })
          })

          req.on('error', (err) => {
            console.error('Upload error:', err)
            writeStream.destroy()
            fsPromises.unlink(filePath).catch(() => {})
            reject({ ok: false, error: 'Server error' })
          })

          writeStream.on('error', (err) => {
            console.error('Write stream error:', err)
            fsPromises.unlink(filePath).catch(() => {})
            reject({ ok: false, error: 'File write error' })
          })

          req.on('aborted', () => {
            console.warn('Client aborted request')
            writeStream.destroy()
            fsPromises.unlink(filePath).catch(() => {})
            reject({ ok: false, error: 'Upload aborted' })
          })
        })
        .catch((err) => {
          console.error('Error creating upload directory:', err)
          reject({ ok: false, error: 'Server error' })
        })
    })
  }

  async download(req, res) {
    try {
      const filePath = path.join(
        '/',
        this.currentDir,
        'uploads',
        req.params.filename
      )

      if (fs.existsSync(filePath)) {
        return {
          ok: true,
          filePath
        }
      } else {
        return {
          ok: false,
          message: 'File not found'
        }
      }
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
