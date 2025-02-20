import { createReadStream } from 'fs'
import { CoreService } from '../core/index.js'

export class RestApi {
  constructor() {
    this.coreService = new CoreService()
    this.currentDir = process.cwd()
  }

  async upload(req, res) {
    try {
      const contentType = req.headers['content-type']

      if (!contentType || !contentType.includes('multipart/form-data')) {
        return res.status(400).json({
          error: 'Invalid Content-Type. Must be multipart/form-data.'
        })
      }

      let result

      try {
        result = await this.coreService.upload(req)
      } catch (uploadError) {
        return res.status(400).json(uploadError)
      }

      if (result.ok === true) {
        return res.status(201).json(result)
      } else {
        return res.status(400).json({ error: 'Upload failed', details: result })
      }
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  async download(req, res) {
    try {
      const result = await this.coreService.download(req, res)

      if (!result.ok) {
        return res.status(404).json({ error: result.message })
      }

      const filePath = result.filePath

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${req.params.filename}"`
      )
      res.setHeader('Content-Type', 'application/octet-stream')

      const readStream = createReadStream(filePath)

      readStream.pipe(res)

      readStream.on('error', (err) => {
        console.error(`File read error: ${err.message}`)
        res.status(500).json({ error: 'Error downloading the file' })
      })
    } catch (err) {
      console.error(`Request processing error: ${err.message}`)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
