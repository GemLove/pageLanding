import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
import streamifier from "streamifier"
dotenv.config()
const storage = multer.memoryStorage()
const upload = multer({ storage })
const uploadMiddleware = upload.single("file")
cloudinary.config({
  cloud_name: "dbcb9xups",
  api_key: "455296626818761",
  api_secret: "iz0Xjb_5cYP5TxrOSMSM-UoWvtQ",
  secure: true,
})
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
export default async function handler(req: any, res: any) {
  await runMiddleware(req, res, uploadMiddleware)
  const stream = await cloudinary.uploader.upload_stream(
    {
      folder: "ThamMyVienVisiana",
    },
    (error, result) => {
      if (error)
        return res.status(error.http_code).json({ err: true, filename: "",message:"Lỗi trong quá trình upload ảnh" })
      res
        .status(200)
        .json({ filename: result?.url + "_name" + req.file.originalname })
    }
  )
  streamifier.createReadStream(req.file.buffer).pipe(stream)
}
export const config = {
  api: {
    bodyParser: false,
  },
}
