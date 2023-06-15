import { NextApiHandler } from "next"
import nodemailer from "nodemailer"
import path from "path"

export const config = {
  api: {
    bodyParser: true,
  },
}

const handler: NextApiHandler = (req, res) => {
  if (req.method === "POST") {
    var gender = req.body.gender
    if (gender == "male") {
      gender = "Nam"
    } else if (gender == "female") {
      gender = "Nữ"
    } else {
      gender = "LGBT"
    }
    var transporter = nodemailer.createTransport({
      // config mail server
      service: "Gmail",
      auth: {
        user: "tinhocnhuy2023@gmail.com",
        pass: "ugnmfuyhnnkvdxlh",
      },
    })
    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      //dothituyetnhi01011993@gmail.com
      from: "trangbkafc123@gmail.com",
      to: "locbkafc123@gmail.com",
      subject: "Tái sinh cuộc đời",
      text: "Thông tin khách hàng ",
      html:
        "<h1>Thông tin khách hàng</h1><ul><li>Họ và tên: " +
        req.body.fullname +
        "</li><li>Giới tính: " +
        gender +
        "</li><li>Ngày sinh: " +
        req.body.birthday +
        "</li><li>Quê quán: " +
        req.body.wards +
        " - " +
        req.body.districts +
        " - " +
        req.body.provinces +
        "</li><li>Số điện thoại: " +
        req.body.numberphone +
        "</li><li>Cậu chuyện của họ: " +
        req.body.description +
        "</li><li>CMT/CCCD:<br/> <img width='250px' src='cid:cmnd'/>" +
        "</li><li>Ảnh chính diện:<br/> <img width='250px' src='cid:avatar'/>" +
        "</li><li>Ảnh nghiêng trái:<br/> <img width='250px' src='cid:avatarLeft'/>" +
        "</li><li>Ảnh nghiêng phải:<br/> <img width='250px' src='cid:avatarRight'/>" +
        "</li></ul>",
      attachments: [
        {
          filename: "cmnd.jpg",
          path:
            path.join(process.cwd(), "/public/images/upload/") + req.body.cmnd,
          cid: "cmnd", //same cid value as in the html img src
        },
        {
          filename: "avatar.jpg",
          path:
            path.join(process.cwd(), "/public/images/upload/") +
            req.body.avatar,
          cid: "avatar", //same cid value as in the html img src
        },
        {
          filename: "avatarLeft.jpg",
          path:
            path.join(process.cwd(), "/public/images/upload/") +
            req.body.avatarLeft,
          cid: "avatarLeft", //same cid value as in the html img src
        },
        {
          filename: "avatarRight.jpg",
          path:
            path.join(process.cwd(), "/public/images/upload/") +
            req.body.avatarRight,
          cid: "avatarRight", //same cid value as in the html img src
        },
      ],
    }
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err)
        res.json("Lỗi hệ thống trong quá trình gửi")
      } else {
        // console.log("Message sent: " + info.response)
        res.json("Gửi thành công")
      }
    })
  }
}

export default handler
