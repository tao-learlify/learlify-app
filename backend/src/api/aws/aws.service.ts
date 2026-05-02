import Multer from 'multer'
import MulterS3 from 'multer-s3'
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { ConfigService } from 'api/config/config.service'
import { generateDateFileName, sanitizeFile } from 'functions'
import { s3Client } from './s3.client'
import type { Readable } from 'stream'
import type { RequestHandler } from 'express'
import type {
  GetObjectCommandInput,
  PutObjectCommandInput,
  DeleteObjectCommandInput,
  DeleteObjectsCommandInput
} from '@aws-sdk/client-s3'
import type { FileInterceptorOptions } from './aws.types'

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

export class AmazonWebServices {
  private uploadKey: string
  private configService: ConfigService

  constructor() {
    this.uploadKey = 'upload'
    this.configService = new ConfigService()
    this.fileInterceptor = this.fileInterceptor.bind(this)
  }

  fileInterceptor({ bucket }: FileInterceptorOptions): RequestHandler {
    const { FILESIZE } = this.configService.provider.MULTIPART_FORMDATA
    const instance = Multer({
      limits: { fileSize: FILESIZE },
      fileFilter(req, file, callback) {
        sanitizeFile(file, callback)
      },
      storage: MulterS3({
        s3: s3Client,
        bucket,
        metadata(req, file, callback) {
          callback(null, { fieldName: file.fieldname })
        },
        key(req, file, callback) {
          callback(null, generateDateFileName(file.originalname))
        }
      })
    })

    return instance.single(this.uploadKey)
  }

  async getObjectBody(params: GetObjectCommandInput): Promise<Buffer> {
    const response = await s3Client.send(new GetObjectCommand(params))
    return streamToBuffer(response.Body as Readable)
  }

  async getJSONFile(params: GetObjectCommandInput, parse?: boolean): Promise<unknown> {
    const buffer = await this.getObjectBody(params)
    const file = buffer.toString()
    return parse ? JSON.parse(file) : file
  }

  async putObject(params: PutObjectCommandInput) {
    return s3Client.send(new PutObjectCommand(params))
  }

  async deleteObject(params: DeleteObjectCommandInput) {
    return s3Client.send(new DeleteObjectCommand(params))
  }

  async deleteObjects(params: DeleteObjectsCommandInput) {
    return s3Client.send(new DeleteObjectsCommand(params))
  }

  async upload(params: PutObjectCommandInput) {
    return new Upload({ client: s3Client, params }).done()
  }
}
