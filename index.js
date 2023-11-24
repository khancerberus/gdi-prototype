import readline from 'node:readline/promises'
import DriveService from './drive.service.js'

/**
 * Prompt user for input
 */
const propmt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const uploadFile = async () => {
  const filePath = await propmt.question('Enter file path: ')
  const mimeType = await propmt.question('Enter mime type: ')

  const response = await DriveService.uploadFile({
    filePath,
    mimeType
  }).catch(console.error)

  console.log(response)
}

const getFiles = async () => {
  console.log('Retrieving data...')
  const response = await DriveService.getFiles().catch(console.error)

  console.log(response)
}

const getFile = async () => {
  const fileId = await propmt.question('Enter file id: ')
  const filePath = await propmt.question('Enter file path: ')

  await DriveService.getFile({
    fileId,
    filePath
  }).catch(console.error)

  console.log('finished download')
}

const main = async () => {
  let option = await propmt.question(`
    1. Upload a sample image
    2. Get a list of files
    3. Get a file
    4. Get storage quota
    5. Exit

    Enter an option:
  `)
  option = parseInt(option)
  switch (option) {
    case 1:
      await uploadFile()
      break
    case 2:
      await getFiles()
      break
    case 3:
      await getFile()
      break
    case 4:
      console.log(await DriveService.getStorageQuota())
      break
    case 5:
      propmt.close()
      process.exit()
    default:
      console.log('Invalid option')
      break
  }

  main()
}

main()
