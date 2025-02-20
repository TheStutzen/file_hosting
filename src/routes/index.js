import { RestApi } from '../api/index.js'

export class Routes {
  constructor(app) {
    this.restApi = new RestApi()
    this.registerRoutes(app)
  }

  registerRoutes(app) {
    app.post('/upload', async (req, res) => this.restApi.upload(req, res))
    app.get('/download/:filename', async (req, res) =>
      this.restApi.download(req, res)
    )
  }
}
