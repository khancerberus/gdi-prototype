import fs from 'fs'
import google from '@googleapis/drive'

/**
 * Authentication for Google Drive
 */
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

/**
 * Create a Google Drive client with the authentication
 */
const drive = google.drive({
  version: 'v3',
  auth
})

/**
 * Upload a file to Google Drive
 */
const uploadFile = async ({ filePath, mimeType }) => {
  const name = filePath.split('/').pop()

  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType
    },
    media: {
      mimeType,
      body: fs.createReadStream(filePath)
    }
  })
  return res.data
}

/**
 * Get a list of files from Google Drive
 * in paginated form with a page size of 10
 * and only return the id and name of the file
 */
const getFiles = async () => {
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)'
  })
  return res.data.files
}

/**
 * Get a file from Google Drive
 * providing the file id
 */
const getFile = async ({ fileId, filePath = './file.png' }) => {
  const { data } = await drive.files.get({
    fileId,
    alt: 'media'
  }, {
    responseType: 'stream'
  })

  data.pipe(fs.createWriteStream(filePath))

  return new Promise((resolve, reject) => {
    data.on('end', () => {
      resolve()
    }).on('error', err => {
      reject(err)
    })
  })
}

/**
 * Get the storage quota of the Google Drive
 */
const getStorageQuota = async () => {
  const res = await drive.about.get({
    fields: 'storageQuota'
  })

  return res.data.storageQuota
}

const DriveService = {
  uploadFile,
  getFiles,
  getFile,
  getStorageQuota
}

export default DriveService
