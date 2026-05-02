declare module 'multer-s3' {
  import type { S3Client } from '@aws-sdk/client-s3'
  import type { StorageEngine } from 'multer'
  import type { Request } from 'express'

  interface MulterS3Options {
    s3: S3Client
    bucket: string | ((req: Request, file: Express.Multer.File, callback: (error: Error | null, bucket: string) => void) => void)
    metadata?: (req: Request, file: Express.Multer.File, callback: (error: Error | null, metadata: Record<string, string>) => void) => void
    key?: (req: Request, file: Express.Multer.File, callback: (error: Error | null, key: string) => void) => void
    contentType?: (req: Request, file: Express.Multer.File, callback: (error: Error | null, mime: string, stream?: NodeJS.ReadableStream) => void) => void
    acl?: string
  }

  function multerS3(options: MulterS3Options): StorageEngine

  namespace multerS3 {
    interface MulterS3File extends Express.Multer.File {
      bucket: string
      key: string
      location: string
      etag: string
      Key: string
    }
  }

  export = multerS3
}
