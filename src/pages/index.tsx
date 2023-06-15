import React, { useEffect, useState } from "react"
import Head from "next/head"
import axios from "axios"

async function logJSONData() {
  const response = await fetch(
    "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1",
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  ).then((resp) => {
    return resp
  })
  const jsonData = await response.json()
  const provinces = jsonData.data.data
  provinces.map((item: any) => {
    var province = String(item.name).replace("Tỉnh ", "")
    province = String(province).replace("Thành phố ", "")
    var option = document.createElement("option")
    option.text = province
    option.value = item.code
    var select: any = document.getElementById("provinces")
    select.appendChild(option)
  })
}

function resetDistricts() {
  var select: any = document.getElementById("districts")
  if (select.getElementsByTagName("option").length > 0) {
    for (
      var i = select.getElementsByTagName("option").length - 1;
      i >= 0;
      i--
    ) {
      select.options[i] = null
    }
  }
}

function resetWards() {
  var select: any = document.getElementById("wards")
  if (select.getElementsByTagName("option").length > 1) {
    for (
      var i = select.getElementsByTagName("option").length - 1;
      i >= 0;
      i--
    ) {
      select.options[i] = null
    }
    var select: any = document.getElementById("wards")
    var option = document.createElement("option")
    option.text = "Phường/xã"
    option.value = ""
    option.classList.add("hidden-visually")
    select.appendChild(option)
  }
}

function alertBox(mess: string) {
  const modal = document.createElement("div")
  modal.classList.add("alert")
  modal.innerHTML = `<div class="alert-message-box">
  <span class="alert-message-head">Alert</span>
  <div class="alert-message-text">${mess}</div>
  <button class="alert-message-close">OK</button>
</div>`
  const element = document.getElementsByTagName("body")
  element[0].appendChild(modal)
  element[0].classList.add("no-scroll")
  const close: any = document.getElementsByClassName("alert-message-close")
  close[0].addEventListener("click", function closeModal() {
    const alret = close[0].parentNode.parentNode
    element[0].classList.remove("no-scroll")
    alret.remove()
  })
}

function removeLoader() {
  document.getElementsByClassName("alert")[0].remove()
  document.getElementsByTagName("body")[0].classList.remove("no-scroll")
}

function loader() {
  const modal = document.createElement("div")
  modal.classList.add("alert")
  modal.innerHTML = `<div class="loader"></div>`
  const element = document.getElementsByTagName("body")
  element[0].classList.add("no-scroll")
  element[0].appendChild(modal)
}

function Home() {
  const [days, setDays] = useState<number>()
  const [hours, setHours] = useState<number>()
  const [minutes, setMinutes] = useState<number>()
  const [seconds, setSeconds] = useState<number>()
  const [selectedCMND, setSelectedCMND] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [selectedLeftAvatar, setSelectedLeftAvatar] = useState("")
  const [selectedRightAvatar, setSelectedRightAvatar] = useState("")

  const handleUpload = async (data: any) => {
    const file = data
    loader()
    try {
      if (!file) return
      const formData = new FormData()
      formData.append("file", file)
      const { data } = await axios.post("/api/upload", formData)
      removeLoader()
      return data.filename
    } catch (error: any) {
      alertBox(error.response?.data.message)
      removeLoader()
      return error.response?.data.filename
    }
  }
  function resetForm() {
    let form = document.querySelector("form")
    if (form) {
      form.reset()
      setSelectedCMND("")
      setSelectedAvatar("")
      setSelectedLeftAvatar("")
      setSelectedRightAvatar("")
    }
  }
  const handleSendMail = async (event: any) => {
    event.preventDefault()
    var form = document.querySelector("form")
    if (form) {
      var formData = new FormData(form)
      var province: any = document.getElementById("provinces")
      province = province.options[province.selectedIndex].text
      formData.set("provinces", province)
      var district: any = document.getElementById("districts")
      district = district.options[district.selectedIndex].text
      formData.set("districts", district)
      var ward: any = document.getElementById("wards")
      ward = ward.options[ward.selectedIndex].text
      formData.set("wards", ward)
      if (
        selectedCMND != "" &&
        selectedAvatar != "" &&
        selectedLeftAvatar != "" &&
        selectedRightAvatar != ""
      ) {
        formData.set(
          "cmnd",
          selectedCMND.substring(0, selectedCMND.indexOf("_name"))
        )
        formData.set(
          "avatar",
          selectedAvatar.substring(0, selectedAvatar.indexOf("_name"))
        )
        formData.set(
          "avatarLeft",
          selectedLeftAvatar.substring(0, selectedLeftAvatar.indexOf("_name"))
        )
        formData.set(
          "avatarRight",
          selectedRightAvatar.substring(0, selectedRightAvatar.indexOf("_name"))
        )
        const queryString = new URLSearchParams(formData as any).toString()
        loader()
        try {
          const { data } = await axios.post("/api/send", queryString)
          removeLoader()
          alertBox(data.mess)
          if (data.err) {
            resetForm()
          }
        } catch (error: any) {
          console.log(error.response?.data)
          alertBox("Gửi thất bại do lỗi server")
        }
      } else {
        alertBox("Vui lòng nhập đầy đủ thông tin")
      }
    }
  }
  useEffect(() => {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24

    //I'm adding this section so I don't have to keep updating this pen every year :-)
    //remove this if you don't need it
    let today: any = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      nextYear = yyyy + 1,
      dayMonth = "06/30/",
      aDate = dayMonth + yyyy

    today = mm + "/" + dd + "/" + yyyy
    if (today === aDate) {
      aDate = dayMonth + (nextYear - 1)
    }
    if (today > aDate) {
      aDate = dayMonth + nextYear
    }
    //end

    const countDown = new Date(aDate).getTime(),
      x = setInterval(function () {
        const now = new Date().getTime(),
          distance = countDown - now

        setDays(Math.floor(distance / day))
        setHours(Math.floor((distance % day) / hour))
        setMinutes(Math.floor((distance % hour) / minute))
        setSeconds(Math.floor((distance % minute) / second))

        //do something later when date is reached
        if (distance < 0) {
          setDays(0)
          setHours(0)
          setMinutes(0)
          setSeconds(0)
          clearInterval(x)
        }
        //seconds
      }, 0)

    logJSONData()

    let selectProvince: any = document.getElementById("provinces")
    selectProvince.addEventListener("change", async function demo() {
      var code = selectProvince.value
      const response = await fetch(
        "https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=" +
          code +
          "&limit=-1"
      )
      const jsonData = await response.json()
      await resetDistricts()
      await resetWards()
      var select: any = document.getElementById("districts")
      var option = document.createElement("option")
      option.text = "Quận/huyện"
      option.value = ""
      option.classList.add("hidden-visually")
      select.appendChild(option)
      const districts = jsonData.data
      districts.data.map((item: any) => {
        var option = document.createElement("option")
        option.text = item.name_with_type
        option.value = item.code
        select.appendChild(option)
      })
    })

    let selectDistricts: any = document.getElementById("districts")
    selectDistricts.addEventListener("change", async function demo() {
      var code = selectDistricts.value
      const response = await fetch(
        "https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=" +
          code +
          "&limit=-1"
      )
      const jsonData = await response.json()
      resetWards()
      var select: any = document.getElementById("wards")
      var option = document.createElement("option")
      option.text = "Phường/xã"
      option.classList.add("hidden-visually")
      option.value = ""
      select.appendChild(option)
      const wards = jsonData.data
      wards.data.map((item: any) => {
        var option = document.createElement("option")
        option.text = item.name_with_type
        option.value = item.code
        select.appendChild(option)
      })
    })
  }, [])

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="icon"
          href="https://nhispa.vn/wp-content/uploads/2023/02/cropped-Logo-NHI-SPA-900x900-PNG-file--32x32.png"
          sizes="32x32"
        />
        <title>Thẩm mỹ viện quốc tế Visiana</title>
      </Head>
      <div className="wrapper">
        <div className="header">
          <img className="background" src="./images/header.jpg" alt="" />
        </div>
        <div className="text">
          <h3 className="title">
            THẨM MỸ NHÂN ÁI, GƯƠNG MẶT RẠNG RỠ, MỞ ĐƯỜNG THÀNH CÔNG - ĐƯỢC TÀI
            TRỢ 100% BỞI THẨM MỸ VIỆN QUỐC TẾ VISIANA
          </h3>
          <p className="description">
            Xã hội hiện nay, vẻ ngoài đóng một phần quan trọng trong cuộc sống,
            thậm chí là có thể thay đổi cơ hội của một con người.
          </p>
          <p className="description">
            Tuy nhiên, không phải ai sinh ra cũng đã có ngoại hình dễ nhìn.
            Nhiều cảnh đời khó khăn cùng ngoại hình không bắt mắt đã mất đi rất
            nhiều cơ hội trong cuộc sống và công việc, dù họ có tài năng và luôn
            cố gắng phấn đấu.
          </p>
          <p className="description">
            Hiểu được vấn đề này, Thẩm Mỹ Viện Quốc Tế Visiana đã khởi động dự
            án "THẨM MỸ NHÂN ÁI - GƯƠNG MẶT RẠNG RỠ, MỞ ĐƯỜNG THÀNH CÔNG" bắt
            đầu trong năm 2023 nhằm Kiến tạo Cuộc đời mới cho nhiều hoàn cảnh
            bất hạnh đó.
          </p>
        </div>
        <div className="banner">
          <img className="banner-images" src="/images/banner/banner-01.jpg" />
        </div>
        <div className="banner banner-count">
          <img className="banner-images" src="/images/banner/banner-02.jpg" />
          <div id="countdown">
            <ul>
              <li>
                <span className="timer" id="days">
                  {days}
                </span>
                <span className="sub-timer">Ngày</span>
              </li>
              <li>
                <span className="timer" id="hours">
                  {hours}
                </span>
                <span className="sub-timer">Giờ</span>
              </li>
              <li>
                <span className="timer" id="minutes">
                  {minutes}
                </span>
                <span className="sub-timer">Phút</span>
              </li>
              <li>
                <span className="timer" id="seconds">
                  {seconds}
                </span>
                <span className="sub-timer">Giây</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="banner">
          <img className="banner-images" src="/images/banner/banner-03.jpg" />
        </div>
        <div className="product">
          <div className="box">
            <img
              className="images"
              src="images/customer/customer-1.jpg"
              alt="ảnh"
            />
            <img
              className="images"
              src="images/customer/customer-2.jpg"
              alt="ảnh"
            />
            <img
              className="images"
              src="images/customer/customer-3.jpg"
              alt="ảnh"
            />
            <img
              className="images"
              src="images/customer/customer-4.jpg"
              alt="ảnh"
            />
            <img
              className="images"
              src="images/customer/customer-5.jpg"
              alt="ảnh"
            />
            <img
              className="images"
              src="images/customer/customer-6.jpg"
              alt="ảnh"
            />
            <img
              className="images"
              src="images/customer/customer-7.jpg"
              alt="ảnh"
            />
            <img
              className="images"
              src="images/customer/customer-8.jpg"
              alt="ảnh"
            />
            <img
              className="images hide-sm"
              src="images/customer/customer-9.jpg"
              alt="ảnh"
            />
          </div>
        </div>
        <form
          className="form-content"
          id="form"
          method="post"
          name="submit"
          encType="multipart/form-data"
          onSubmit={(event: any) => {
            handleSendMail(event)
          }}
        >
          <div className="form-item">
            <img className="image" src="/images/top-background.png" alt="" />
          </div>
          <div className="form-item">
            <h1 className="title">
              Bạn vui lòng điền
              <span className="hightlight"> đầy đủ thông tin </span> để tham
              gia!
            </h1>
          </div>
          <div className="form-item">
            <input
              className="input-control"
              id="fullname"
              type="text"
              name="fullname"
              placeholder="Họ và tên"
              required
            />
          </div>
          <div className="form-item">
            <select
              className="input-control"
              id="gender"
              name="gender"
              required={true}
            >
              <option className="hidden-visually" value="">
                Giới tính
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">LGBT</option>
            </select>
          </div>
          <div className="form-item">
            <input
              className="input-control"
              id="birthday"
              type="date"
              name="birthday"
              placeholder="Ngày sinh"
              required={true}
            />
          </div>
          <div className="form-item">
            <select
              className="input-control"
              id="provinces"
              name="provinces"
              required={true}
            >
              <option className="hidden-visually" value="">
                Thành phố/Tỉnh
              </option>
            </select>
            <select
              className="input-control"
              id="districts"
              name="districts"
              required={true}
            >
              <option className="hidden-visually" value="">
                Quận/huyện
              </option>
            </select>
            <select
              className="input-control"
              id="wards"
              name="wards"
              required={true}
            >
              <option className="hidden-visually" value="">
                Phường/xã
              </option>
            </select>
          </div>
          <div className="form-item">
            <input
              className="input-control"
              id="numberphone"
              type="text"
              name="numberphone"
              placeholder="Số điện thoại"
              required={true}
              pattern="(0)(9|8|7|5|3)[0-9]{8}"
            />
          </div>
          <div className="form-item">
            <input
              className="hidden-visually"
              id="cmnd"
              type="file"
              name="cmnd"
              accept="image/*"
              onChange={async (event) => {
                if (event.target.files?.length) {
                  const file: any = event.target.files
                  if (file[0]) {
                    const filename = await handleUpload(file[0])
                    setSelectedCMND(filename)
                  } else {
                    setSelectedCMND("")
                  }
                }
              }}
            />
            <label className="input-file-control" htmlFor="cmnd">
              {selectedCMND !== ""
                ? selectedCMND.substring(
                    selectedCMND.indexOf("_name") + 5,
                    selectedCMND.length
                  )
                : "CMT/CCCD"}
            </label>
          </div>
          <div className="form-item">
            <input
              className="hidden-visually"
              id="avatar"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={async (event) => {
                if (event.target.files?.length) {
                  const file: any = event.target.files
                  if (file[0]) {
                    const filename = await handleUpload(file[0])
                    setSelectedAvatar(filename)
                  } else {
                    setSelectedAvatar("")
                  }
                }
              }}
            />
            <label className="input-file-control" htmlFor="avatar">
              {selectedAvatar !== ""
                ? selectedAvatar.substring(
                    selectedAvatar.indexOf("_name") + 5,
                    selectedAvatar.length
                  )
                : "Ảnh chính diện"}
            </label>
          </div>
          <div className="form-item">
            <input
              className="hidden-visually"
              id="avatarLeft"
              type="file"
              name="avatarLeft"
              accept="image/*"
              onChange={async (event) => {
                if (event.target.files?.length) {
                  const file: any = event.target.files
                  if (file[0]) {
                    const filename = await handleUpload(file[0])
                    setSelectedLeftAvatar(filename)
                  } else {
                    setSelectedLeftAvatar("")
                  }
                }
              }}
            />
            <label className="input-file-control" htmlFor="avatarLeft">
              {selectedLeftAvatar !== ""
                ? selectedLeftAvatar.substring(
                    selectedLeftAvatar.indexOf("_name") + 5,
                    selectedLeftAvatar.length
                  )
                : "Ảnh nghiêng trái"}
            </label>
          </div>
          <div className="form-item">
            <input
              className="hidden-visually"
              id="avatarRight"
              type="file"
              name="avatarRight"
              accept="image/*"
              onChange={async (event) => {
                if (event.target.files?.length) {
                  const file: any = event.target.files
                  if (file[0]) {
                    const filename = await handleUpload(file[0])
                    setSelectedRightAvatar(filename)
                  } else {
                    setSelectedRightAvatar("")
                  }
                }
              }}
            />
            <label className="input-file-control" htmlFor="avatarRight">
              {selectedRightAvatar !== ""
                ? selectedRightAvatar.substring(
                    selectedRightAvatar.lastIndexOf("_name") + 5,
                    selectedRightAvatar.length
                  )
                : "Ảnh nghiêng phải"}
            </label>
          </div>
          <div className="form-item">
            <textarea
              className="input-control"
              id="description"
              name="description"
              cols={30}
              rows={10}
              placeholder="Câu chuyện của bạn..!"
              required={true}
            ></textarea>
          </div>
          <div className="form-item">
            <div className="checkbox-control">
              <input id="check" type="checkbox" name="check" required={true} />
              <label htmlFor="check">
                Tôi đã đọc và đồng ý với thể lệ của chương trình
              </label>
            </div>
          </div>
          <div className="form-item">
            <button className="btn" id="submit" type="submit">
              NỘP HỘP SƠ
            </button>
          </div>
        </form>
        <div className="flex-box">
          <div className="flex-item">
            <a className="btn btn-call" href="tel:0944968689">
              {" "}
              <img className="icon" src="/images/icon/call.png" alt="icon" />
            </a>
          </div>
        </div>
        <div className="flex-box-right">
          <div className="flex-item">
            <a
              className="btn btn-call"
              href="https://m.me/109944473767206"
              target="_blank"
            >
              <img
                className="icon"
                src="/images/icon/messenger.png"
                alt="icon"
              />
            </a>
          </div>
        </div>
        <div className="footer">
          <div className="content">
            <div className="tab-left">
              <h3 className="title">Thẩm mỹ viện quốc tế VISIANA</h3>
              <ul className="list-contact">
                <li className="contact-item">
                  Địa chỉ: Số 74 Hoà Bình, P3, TP Bạc Liêu (gần vòng xoay Ngã Tư
                  Quốc Tế)
                </li>
                <li className="contact-item">
                  Hotline: 0944 968 689 &ndash; 0845 580 052
                </li>
                <li className="contact-item">
                  Email: dothituyetnhi01011993@gmail.com
                </li>
                <li className="contact-item">
                  Website: thammyvienquoctevisiana.vn
                </li>
              </ul>
            </div>
            <div className="tab-right">
              <h3 className="title">Dịch vụ khách hàng</h3>
              <ul className="list-contact">
                <li className="contact-item">Thanh toán</li>
                <li className="contact-item">Chính sách bảo mật</li>
                <li className="contact-item">Điều khoản bảo hành</li>
                <li className="contact-item">Liên hệ</li>
              </ul>
              <div className="box">
                <div className="box-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 58 37"
                  >
                    <path
                      fill="#0F1822"
                      d="M55 0H3a3 3 0 00-3 3v31a3 3 0 003 3h52a3 3 0 003-3V3a3 3 0 00-3-3z"
                    ></path>
                    <path
                      fill="#F26522"
                      d="M35.774 6.685H22.682v23.529h13.092V6.685z"
                    ></path>
                    <path
                      fill="#E52423"
                      d="M23.546 18.45c0-4.774 2.235-9.025 5.715-11.765a14.905 14.905 0 00-9.247-3.198C11.75 3.487 5.05 10.186 5.05 18.45c0 8.263 6.699 14.962 14.963 14.962 3.49 0 6.702-1.196 9.247-3.198-3.48-2.743-5.715-6.991-5.715-11.764z"
                    ></path>
                    <path
                      fill="#F99F1C"
                      d="M52.043 27.718v-.483h.195v-.098h-.494v.098h.195v.483h.104zm.96 0v-.58h-.153l-.174.4-.174-.4h-.153v.58h.108v-.438l.163.379h.111l.164-.379v.438h.108zM38.51 3.487a14.908 14.908 0 00-9.248 3.198 14.938 14.938 0 015.715 11.765c0 4.773-2.235 9.021-5.715 11.76a14.904 14.904 0 009.247 3.199c8.264 0 14.963-6.7 14.963-14.963-.004-8.26-6.7-14.959-14.963-14.959z"
                    ></path>
                  </svg>
                </div>
                <div className="box-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 58 37"
                  >
                    <path
                      fill="#1A1F70"
                      d="M55.093 37H2.907A2.895 2.895 0 010 34.093V3.178A2.895 2.895 0 012.907.271h52.186A2.895 2.895 0 0158 3.178v30.915C58 35.708 56.662 37 55.093 37z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M28.84 13.053l-2.4 11.166h-2.907l2.4-11.167h2.907zm12.135 7.244l1.522-4.2.877 4.2h-2.4zm3.23 3.922h2.676l-2.353-11.167h-2.446c-.554 0-1.015.324-1.246.831L36.5 24.219h3.045l.6-1.661h3.692l.369 1.66zm-7.521-3.645c0-2.954-4.06-3.092-4.06-4.43 0-.415.368-.83 1.245-.923.415-.046 1.569-.092 2.86.508l.508-2.353c-.692-.231-1.569-.508-2.722-.508-2.86 0-4.845 1.523-4.891 3.691 0 1.615 1.43 2.492 2.538 3.046 1.107.553 1.522.876 1.476 1.384 0 .738-.877 1.061-1.707 1.107-1.477 0-2.307-.415-2.953-.692l-.554 2.4c.692.323 1.938.6 3.23.6 3 0 4.983-1.477 5.03-3.83zm-11.997-7.522l-4.66 11.167H16.98l-2.307-8.906c-.138-.553-.277-.738-.692-.969-.692-.369-1.846-.738-2.86-.968l.091-.323h4.938c.646 0 1.2.415 1.338 1.153l1.2 6.46 2.998-7.614h3z"
                    ></path>
                  </svg>
                </div>
                <div className="box-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="80px"
                    height="40px"
                    viewBox="0 0 120 46"
                    version="1.1"
                  >
                    <title>01A4C888-5C08-4E72-A790-500649432FF1</title>
                    <desc>Created with sketchtool.</desc>
                    <defs></defs>
                    <g
                      id="Symbols"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="footer"
                        transform="translate(-1299.000000, -766.000000)"
                      >
                        <g id="copyright">
                          <g transform="translate(0.000000, 761.000000)">
                            <g
                              id="ic_bo-cong-thuong"
                              transform="translate(1299.000000, 5.000000)"
                            >
                              <g id="Group">
                                <g id="#ffffffff" fill="#FFFFFF">
                                  <path
                                    id="Shape"
                                    d="M22.162847,0 L22.8401423,0 C28.2619217,0.0700355872 33.6341637,2.17879004 37.6313167,5.84626335 C38.6886833,6.78234875 39.6298932,7.84483986 40.4839858,8.96797153 C42.5295374,11.6780071 43.9456228,14.8586477 44.5930249,18.1913167 C45.3301068,21.9450534 45.0883986,25.8866904 43.8892527,29.5191459 C43.0923843,31.9635587 41.8641993,34.264484 40.2918149,36.2980783 C38.566548,38.5221352 36.4219217,40.4173665 34.0005694,41.8539502 C30.6431317,43.8559431 26.7561566,44.9508897 22.8486833,45.0106762 L22.1679715,45.0106762 C18.507331,44.954306 14.8620641,43.994306 11.6566548,42.2229181 C8.80398577,40.6573665 6.30064057,38.4632028 4.37551601,35.8402847 C1.61338078,32.1027758 0.064911032,27.4906762 0,22.8444128 L0,22.1645552 C0.0392882562,19.9148754 0.406548043,17.6694662 1.1086121,15.5308185 C2.71772242,10.5377936 6.14604982,6.16227758 10.6069751,3.40185053 C14.0549466,1.246121 18.0973665,0.0606405694 22.162847,0 L22.162847,0 Z M19.8046975,5.32782918 C16.448968,5.83601423 13.255516,7.35288256 10.7376512,9.62903915 C9.01921708,11.1723843 7.61679715,13.0667616 6.63202847,15.1550178 C5.15017794,18.2698932 4.63003559,21.8288968 5.14846975,25.2384342 C5.62761566,28.4540925 7.02747331,31.5262633 9.14135231,33.9954448 C11.8120996,37.1530249 15.646121,39.2942349 19.7320996,39.9279715 C23.4243416,40.5190036 27.3002135,39.8818505 30.6064057,38.132669 C33.6879715,36.5244128 36.2622064,33.9698221 37.8960854,30.9010676 C39.6597865,27.636726 40.3208541,23.806121 39.7990036,20.1352313 C33.922847,25.9678292 28.06121,31.8149466 22.1867616,37.6492527 C21.7409253,38.104484 21.0200712,38.2214947 20.436726,37.9925979 C20.0660498,37.8499644 19.8029893,37.5424911 19.5288256,37.2700356 C15.9177224,33.6751601 12.3032028,30.0837011 8.69295374,26.4879715 C8.07544484,25.9123132 8.02846975,24.8498221 8.60669039,24.230605 C9.13879004,23.6822776 9.68797153,23.1493238 10.2294662,22.6095374 C10.6958007,22.1406406 11.4516726,22.0048399 12.0538078,22.2747331 C12.4407117,22.4318861 12.6977936,22.7743772 12.9950178,23.0511032 C15.6837011,25.7269751 18.3732384,28.4011388 21.0610676,31.0778648 C26.4281851,25.7312456 31.8012811,20.390605 37.1683986,15.0448399 C37.3887544,14.8022776 37.6637722,14.6160854 37.9712456,14.5007829 C36.2374377,11.1869039 33.4180783,8.4572242 30.0401423,6.84982206 C26.8851246,5.3252669 23.2663345,4.78975089 19.8046975,5.32782918 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M22.7513167,9.18405694 C23.2970819,8.9483274 24.0059786,9.2224911 24.1896085,9.80327402 C24.3407829,10.3225623 24.3194306,10.9639858 23.9316726,11.3799288 C23.4362989,11.888968 22.4438434,11.723274 22.191032,11.0408541 C21.9476157,10.4096797 22.0543772,9.4744484 22.7513167,9.18405694 L22.7513167,9.18405694 Z M23.0186477,9.61708185 C22.7735231,9.71359431 22.7308185,10.0116726 22.7034875,10.2405694 C22.6906762,10.5301068 22.6838434,10.8683274 22.8948043,11.0963701 C23.104911,11.29879 23.4815658,11.1886121 23.5652669,10.9135943 C23.685694,10.5711032 23.7036299,10.1765125 23.566121,9.83658363 C23.4841281,9.61964413 23.2253381,9.5427758 23.0186477,9.61708185 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M24.8130961,9.17295374 C25.0360142,9.20882562 25.2589324,9.24298932 25.4801423,9.29081851 C25.5202847,9.9194306 25.5817794,10.5480427 25.606548,11.178363 C25.8755872,10.6095374 26.1702491,10.0543772 26.4418505,9.48725979 C26.6656228,9.53081851 26.8885409,9.57608541 27.1123132,9.62049822 C26.6852669,10.3900356 26.2368683,11.1476157 25.799573,11.9111744 C25.5800712,11.8693238 25.3605694,11.8257651 25.1436299,11.7711032 C25.0360142,10.9050534 24.9360854,10.0372954 24.8130961,9.17295374 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M19.8841281,9.46932384 C20.234306,9.2797153 20.704911,9.22676157 21.0602135,9.42918149 C21.2566548,9.54875445 21.3565836,9.76313167 21.4454093,9.9655516 C21.2566548,10.0167972 21.064484,10.0552313 20.870605,10.08 C20.8014235,9.96298932 20.7125979,9.86049822 20.6092527,9.77252669 C20.4042705,9.77081851 20.17879,9.80925267 20.0737367,10.0082562 C19.975516,10.2721708 20.0327402,10.5591459 20.0933808,10.8247687 C20.1454804,11.0340214 20.2325979,11.2629181 20.4418505,11.3611388 C20.6451246,11.4414235 20.8509609,11.335516 21.0414235,11.270605 C21.027758,11.1296797 21.0106762,10.9896085 20.9859075,10.8503915 C20.843274,10.8708897 20.7006406,10.8939502 20.5580071,10.9161566 C20.5366548,10.7777936 20.5144484,10.6402847 20.4930961,10.5027758 C20.8261922,10.4370107 21.1601423,10.3720996 21.4932384,10.3088968 C21.5658363,10.652242 21.6324555,10.9972954 21.6930961,11.3432028 C21.3463345,11.750605 20.7715302,11.9479004 20.2479715,11.8411388 C19.7705338,11.7215658 19.5083274,11.233879 19.4485409,10.7777936 C19.3323843,10.3097509 19.4365836,9.72640569 19.8841281,9.46932384 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M28.310605,10.0680427 C28.5258363,10.1295374 28.725694,10.2337367 28.9255516,10.3345196 C28.8068327,10.9451957 28.7086121,11.5609964 28.5813523,12.1699644 C28.9930249,11.7027758 29.400427,11.2313167 29.8052669,10.7581495 C30.0136655,10.8529537 30.22121,10.9520285 30.4261922,11.0553737 C29.8095374,11.686548 29.1997153,12.3237011 28.5762278,12.9488968 C28.3772242,12.8498221 28.1782206,12.7507473 27.9800712,12.6499644 C28.1030605,11.7907473 28.1953025,10.9281139 28.310605,10.0680427 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M76.7274021,10.1133096 C77.132242,10.1107473 77.5370819,10.1124555 77.9427758,10.1124555 C77.9795018,10.3430605 78.0162278,10.6351601 78.2630605,10.7385053 C78.5978648,10.8768683 78.9924555,10.8708897 79.3281139,10.7376512 C79.5792171,10.6402847 79.6236299,10.347331 79.6595018,10.1124555 C80.0634875,10.1116014 80.4674733,10.1107473 80.8723132,10.1133096 C80.9039146,10.8179359 80.4768683,11.5353737 79.781637,11.7369395 C79.1188612,11.9308185 78.3800712,11.9367972 77.7249822,11.7121708 C77.0681851,11.4815658 76.7325267,10.7743772 76.7274021,10.1133096 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M112.007402,10.1654093 C112.677865,10.1619929 113.349181,10.1637011 114.021352,10.1654093 C113.391032,10.735089 112.765836,11.3098932 112.137224,11.880427 C111.676014,11.8812811 111.215658,11.8821352 110.756157,11.879573 C111.168683,11.3056228 111.590605,10.7376512 112.007402,10.1654093 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M15.8818505,10.9964413 C16.4113879,10.7658363 16.9153025,10.4831317 17.4380071,10.2388612 C17.5088968,10.3806406 17.5806406,10.523274 17.6532384,10.6650534 C17.3235587,10.836726 16.9853381,10.9896085 16.6505338,11.1501779 C16.7137367,11.3090391 16.7786477,11.4670463 16.8597865,11.6182206 C17.1450534,11.4781495 17.4328826,11.344911 17.7172954,11.2039858 C17.7839146,11.3389324 17.8505338,11.4747331 17.917153,11.6096797 C17.6361566,11.750605 17.354306,11.8906762 17.0733096,12.0324555 C17.1587189,12.2049822 17.2441281,12.3766548 17.3295374,12.5491815 C17.6626335,12.3869039 17.990605,12.2152313 18.3288256,12.0657651 C18.3988612,12.2066904 18.4680427,12.3476157 18.5380783,12.4885409 C18.0247687,12.747331 17.5054804,12.9907473 16.9913167,13.2452669 C16.6138078,12.4996441 16.2499644,11.7471886 15.8818505,10.9964413 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M58.5403559,11.2782918 C58.7436299,10.7777936 59.1544484,10.3439146 59.7027758,10.246548 C60.2809964,10.0791459 60.8472598,10.3336655 61.375089,10.5463345 C61.799573,10.7231317 62.3547331,10.6163701 62.5682562,10.1748043 C62.8945196,10.3703915 63.221637,10.5634164 63.5496085,10.7547331 C63.3463345,11.2714591 62.9116014,11.7087544 62.3479004,11.7992883 C61.7953025,11.9427758 61.2546619,11.7121708 60.7541637,11.5029181 C60.3262633,11.3133096 59.7386477,11.3987189 59.5276868,11.8607829 C59.1980071,11.6669039 58.8691815,11.4730249 58.5403559,11.2782918 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M14.6989324,11.7898932 C14.8603559,11.6669039 15.0251957,11.547331 15.1908897,11.4303203 C15.6845552,12.0973665 16.1876157,12.7575801 16.6787189,13.4263345 C16.5172954,13.5476157 16.3558719,13.6688968 16.1944484,13.7901779 C15.6572242,13.5493238 15.1148754,13.3178648 14.5776512,13.0778648 C14.8919573,13.4827046 15.1960142,13.8960854 15.4975089,14.3111744 C15.332669,14.4298932 15.1712456,14.5520285 15.0115302,14.676726 C14.5101779,14.0105338 14.0173665,13.3375089 13.5168683,12.6713167 C13.6791459,12.5525979 13.8405694,12.4321708 14.0002847,12.3091815 C14.5426335,12.5483274 15.0901068,12.7746619 15.627331,13.0274733 C15.3113167,12.6192171 15.0123843,12.1990036 14.6989324,11.7898932 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M31.0146619,11.4414235 C31.1820641,11.5592883 31.3451957,11.6822776 31.5066192,11.8086833 C31.4357295,12.3945907 31.3554448,12.97879 31.2862633,13.5638434 C31.5809253,13.1436299 31.8969395,12.7370819 32.2069751,12.3271174 C32.3658363,12.4509609 32.5281139,12.5705338 32.6929537,12.6875445 C32.1941637,13.3562989 31.6919573,14.0233452 31.1914591,14.6912456 C31.0223488,14.5699644 30.8566548,14.4444128 30.7003559,14.307758 C30.802847,13.7286833 30.840427,13.1410676 30.9403559,12.5619929 C30.6354448,12.9813523 30.3177224,13.3904626 30.0119573,13.8081139 C29.8471174,13.6868327 29.6848399,13.5621352 29.5251246,13.4348754 C30.0179359,12.7678292 30.5218505,12.1093238 31.0146619,11.4414235 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M26.6758719,11.6549466 C26.8620641,11.6079715 27.0841281,11.704484 27.1242705,11.9051957 C27.1558719,12.1409253 26.852669,12.3501779 26.6519573,12.1998577 C26.4025623,12.1272598 26.4256228,11.7053381 26.6758719,11.6549466 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M18.996726,11.7429181 C19.2247687,11.6805694 19.4570819,11.9863345 19.3041993,12.1819217 C19.1846263,12.3809253 18.8267616,12.4279004 18.729395,12.1836299 C18.6251957,11.9854804 18.7968683,11.7728114 18.996726,11.7429181 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M59.5618505,12.3313879 C60.5517438,12.3339502 61.5424911,12.332242 62.5332384,12.332242 C63.2165125,15.9561566 63.9125979,19.5775089 64.5898932,23.2022776 C63.9066192,23.2031317 63.2233452,23.2014235 62.5409253,23.2031317 C62.4136655,22.5497509 62.3069039,21.8929537 62.1864769,21.2387189 C61.3631317,21.2378648 60.5406406,21.2378648 59.7181495,21.2387189 C59.5951601,21.8895374 59.5140214,22.5608541 59.3517438,23.197153 C58.7333808,23.2108185 58.1141637,23.1997153 57.4958007,23.2005694 C58.1884698,19.578363 58.8657651,15.9535943 59.5618505,12.3313879 L59.5618505,12.3313879 Z M59.9837722,19.68 C60.6243416,19.6765836 61.264911,19.6757295 61.9054804,19.68 C61.5911744,17.8684698 61.2563701,16.0595018 60.9446263,14.2479715 C60.6328826,16.0595018 60.2989324,17.8684698 59.9837722,19.68 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M91.4083986,13.4263345 C91.8345907,12.7336655 92.6468327,12.3962989 93.4300356,12.322847 C94.1893238,12.2664769 94.9861922,12.2784342 95.6916726,12.600427 C96.2442705,12.8446975 96.6858363,13.3255516 96.877153,13.8995018 C97.1188612,14.5972954 97.0411388,15.3480427 97.0548043,16.0731673 C96.4099644,16.0748754 95.7659786,16.0748754 95.122847,16.0731673 C95.1083274,15.5683986 95.1527402,15.0593594 95.0886833,14.557153 C94.9315302,13.5467616 93.0858363,13.6133808 93.0610676,14.6681851 C93.0269039,16.5813523 93.0576512,18.4962278 93.045694,20.409395 C93.0533808,20.7262633 93.0166548,21.0679004 93.1763701,21.3565836 C93.3104626,21.6017082 93.5940214,21.7212811 93.8604982,21.7537367 C94.208968,21.7955872 94.6044128,21.7554448 94.873452,21.5060498 C95.0920996,21.2882562 95.1160142,20.9602847 95.1202847,20.6698932 C95.1245552,20.0173665 95.1194306,19.365694 95.122847,18.7140214 C94.8179359,18.7140214 94.513879,18.7140214 94.2106762,18.7131673 C94.208968,18.1981495 94.2098221,17.6822776 94.2098221,17.1672598 C95.1578648,17.1672598 96.1067616,17.1664057 97.0548043,17.1681139 C97.0513879,18.3339502 97.0624911,19.4997865 97.0496797,20.6664769 C97.0402847,21.3685409 96.839573,22.1124555 96.3066192,22.6009964 C95.6814235,23.1894662 94.7777936,23.3372242 93.9501779,23.3175801 C93.1362278,23.3209964 92.2496797,23.1348043 91.6697509,22.5215658 C91.1683986,22.0133808 91.0086833,21.2728826 91.0052669,20.5810676 C91.0035587,19.0454093 91.0052669,17.5088968 91.0044128,15.9723843 C91.0103915,15.1165836 90.923274,14.1822064 91.4083986,13.4263345 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M50.5153025,12.3851957 C51.6683274,12.3851957 52.8222064,12.3809253 53.9760854,12.3869039 C54.756726,12.405694 55.605694,12.6029893 56.1446263,13.209395 C56.6101068,13.7252669 56.7424911,14.4452669 56.7459075,15.1191459 C56.7493238,16.8837011 56.7467616,18.6474021 56.7476157,20.4111032 C56.7501779,21.1123132 56.630605,21.867331 56.1454804,22.4062633 C55.606548,23.012669 54.7575801,23.2099644 53.9777936,23.2287544 C52.8230605,23.2347331 51.6691815,23.2304626 50.5153025,23.2304626 C50.5161566,21.6683274 50.5144484,20.1053381 50.5161566,18.5432028 C50.2958007,18.5432028 50.0754448,18.5432028 49.8559431,18.5423488 C49.8542349,18.0845552 49.855089,17.6259075 49.855089,17.1681139 C50.0745907,17.1672598 50.2949466,17.1672598 50.5153025,17.1664057 C50.5153025,15.572669 50.5161566,13.9789324 50.5153025,12.3851957 L50.5153025,12.3851957 Z M52.5617082,13.9311032 C52.5642705,15.0098221 52.5625623,16.0876868 52.5625623,17.1664057 C52.9759431,17.1681139 53.3901779,17.1664057 53.8044128,17.1672598 C53.8035587,17.6259075 53.8044128,18.0837011 53.8035587,18.5423488 C53.3893238,18.5440569 52.975089,18.5423488 52.5617082,18.5432028 C52.5642705,19.5928826 52.5625623,20.6434164 52.5625623,21.6930961 C53.0929537,21.673452 53.6387189,21.7537367 54.1580071,21.6102491 C54.5244128,21.5009253 54.7097509,21.1123132 54.6977936,20.7501779 C54.7029181,18.7900356 54.7020641,16.8290391 54.6977936,14.8680427 C54.7157295,14.4854093 54.4996441,14.0814235 54.1076157,13.9883274 C53.6002847,13.8781495 53.0758719,13.9516014 52.5617082,13.9311032 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M68.3658363,12.3851957 C69.5222776,12.3851957 70.6787189,12.3809253 71.8351601,12.3869039 C72.6123843,12.406548 73.4579359,12.6046975 73.9951601,13.2085409 C74.4606406,13.726121 74.5930249,14.4469751 74.5972954,15.1225623 C74.5998577,16.6291815 74.5972954,18.1366548 74.5981495,19.6441281 C74.5930249,20.2103915 74.6271886,20.7826335 74.5135943,21.3403559 C74.4,21.8886833 74.1010676,22.4113879 73.6313167,22.7291103 C73.0325979,23.1382206 72.2844128,23.233879 71.5763701,23.2364413 C70.5061922,23.2458363 69.4360142,23.2398577 68.3666904,23.2390036 C68.3658363,21.673452 68.3658363,20.1087544 68.3666904,18.5432028 C68.1454804,18.5432028 67.9259786,18.5432028 67.7064769,18.5423488 C67.7047687,18.0837011 67.7047687,17.6259075 67.7056228,17.1681139 C67.9251246,17.1672598 68.1454804,17.1672598 68.3658363,17.1664057 C68.3658363,15.572669 68.3666904,13.9789324 68.3658363,12.3851957 L68.3658363,12.3851957 Z M70.412242,13.9311032 C70.4139502,15.0098221 70.4130961,16.0876868 70.4130961,17.1664057 C70.8264769,17.1681139 71.2407117,17.1664057 71.6549466,17.1672598 C71.6540925,17.6259075 71.6549466,18.0837011 71.6540925,18.5423488 C71.2398577,18.5440569 70.8256228,18.5423488 70.412242,18.5432028 C70.4139502,19.5928826 70.4130961,20.6434164 70.4130961,21.6930961 C70.9451957,21.673452 71.492669,21.7554448 72.0128114,21.6085409 C72.3775089,21.498363 72.5602847,21.1097509 72.5483274,20.7493238 C72.553452,18.7874733 72.553452,16.8256228 72.5483274,14.8646263 C72.5654093,14.4811388 72.3467616,14.0780071 71.953879,13.9874733 C71.4474021,13.8790036 70.9246975,13.9516014 70.412242,13.9311032 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M77.3235587,12.3843416 C78.3151601,12.3851957 79.3076157,12.3834875 80.3009253,12.3851957 C80.9790747,16.0039858 81.6768683,19.6202135 82.3507473,23.2398577 C81.6683274,23.2415658 80.9850534,23.2407117 80.3026335,23.2398577 C80.1770819,22.587331 80.067758,21.9313879 79.9498932,21.277153 C79.1274021,21.277153 78.304911,21.2737367 77.483274,21.2780071 C77.3748043,21.9330961 77.2518149,22.5856228 77.1390747,23.2407117 C76.5130249,23.2398577 75.8878292,23.2424199 75.2617794,23.2390036 C75.9518861,19.6210676 76.6325979,16.0014235 77.3235587,12.3843416 L77.3235587,12.3843416 Z M77.7497509,19.7295374 L79.6748754,19.7295374 C79.3562989,17.917153 79.0240569,16.107331 78.710605,14.2940925 C78.397153,16.107331 78.0632028,17.9162989 77.7497509,19.7295374 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M83.2979359,12.3851957 C84.1494662,12.3834875 85.0009964,12.3843416 85.8525267,12.3843416 C86.5349466,14.5255516 87.2182206,16.6676157 87.9057651,18.8071174 C87.9066192,16.6667616 87.9057651,14.5255516 87.9057651,12.3851957 C88.5121708,12.3843416 89.1194306,12.3834875 89.7266904,12.3851957 C89.7266904,15.8878292 89.7241281,19.3904626 89.7283986,22.8930961 C89.7121708,23.003274 89.7582918,23.1382206 89.7002135,23.2355872 C89.0109609,23.2483986 88.3208541,23.2372954 87.6324555,23.2398577 C86.797153,20.6314591 85.9575801,18.0239146 85.1299644,15.4129537 C85.1367972,18.0213523 85.1316726,20.630605 85.1325267,23.2398577 C84.5209964,23.2415658 83.9094662,23.2407117 83.29879,23.2398577 C83.2979359,19.6219217 83.29879,16.0031317 83.2979359,12.3851957 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M101.248399,12.3851957 C101.930819,12.3834875 102.613238,12.3843416 103.295658,12.3843416 C103.29395,13.9507473 103.299929,15.5162989 103.292242,17.0818505 C104.153167,15.5094662 105.039715,13.9516014 105.91089,12.3851957 C106.591601,12.3843416 107.273167,12.3834875 107.955587,12.3851957 C107.019502,13.994306 106.088541,15.6068327 105.148185,17.2142349 C106.079146,19.2247687 107.024626,21.2293238 107.958149,23.2390036 C107.258648,23.2415658 106.56,23.2415658 105.862206,23.2398577 C105.207972,21.8015658 104.553737,20.3641281 103.903772,18.9241281 C103.71331,19.2563701 103.480996,19.5638434 103.304199,19.9020641 C103.283701,21.0140925 103.302491,22.1269751 103.295658,23.2398577 C102.613238,23.2407117 101.930819,23.2424199 101.248399,23.2390036 C101.248399,19.6210676 101.249253,16.0031317 101.248399,12.3851957 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M108.191317,12.3869039 C108.901068,12.3826335 109.610819,12.3843416 110.320569,12.3851957 C110.833025,14.0241993 111.349751,15.6606406 111.853665,17.3022064 C112.361851,15.6623488 112.876868,14.0250534 113.385053,12.3851957 C114.035018,12.3834875 114.684982,12.3843416 115.334947,12.3843416 C114.496228,14.7809253 113.644698,17.1723843 112.810249,19.5698221 C112.754733,20.7894662 112.802562,22.0167972 112.786335,23.2390036 C112.103915,23.2424199 111.422349,23.2407117 110.739929,23.2398577 C110.739075,22.0979359 110.738221,20.9560142 110.741637,19.8140925 C110.753594,19.5775089 110.640854,19.3622776 110.56911,19.144484 C109.777367,16.8913879 108.981352,14.64 108.191317,12.3869039 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M12.5389324,13.6176512 C12.6781495,13.476726 12.8182206,13.3375089 12.9582918,13.1982918 C13.5501779,13.7876157 14.1403559,14.3786477 14.7305338,14.9705338 C14.5913167,15.1097509 14.4529537,15.248968 14.3145907,15.3890391 C13.7090391,14.8125267 13.1222776,14.2163701 12.5389324,13.6176512 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M11.0903915,15.3096085 C11.215089,15.1498932 11.3406406,14.991032 11.4661922,14.8321708 C11.9957295,15.248968 12.5286833,15.6614947 13.0548043,16.0825623 C13.2768683,15.8169395 13.4835587,15.5402135 13.6979359,15.2703203 C13.8286121,15.3608541 13.956726,15.4548043 14.0822776,15.5521708 C13.7380783,15.9843416 13.3990036,16.421637 13.0573665,16.8563701 C12.4005694,16.3422064 11.7377936,15.8357295 11.0903915,15.3096085 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M10.5898932,16.0424199 C11.3286833,16.4267616 12.0632028,16.8204982 12.8037011,17.2031317 C12.7157295,17.3850534 12.6269039,17.5669751 12.5286833,17.7429181 C11.9333808,17.7446263 11.3406406,17.8078292 10.7453381,17.7933096 C11.2031317,18.036726 11.6626335,18.2758719 12.1221352,18.5150178 C12.027331,18.6943772 11.9333808,18.8745907 11.8368683,19.0530961 C11.0912456,18.6815658 10.3635587,18.276726 9.62391459,17.8940925 C9.7144484,17.713879 9.80839858,17.5362278 9.90405694,17.3594306 C10.4916726,17.3517438 11.0784342,17.2970819 11.6660498,17.3064769 C11.2193594,17.0570819 10.7649822,16.8204982 10.3114591,16.5847687 C10.4079715,16.4054093 10.5002135,16.2243416 10.5898932,16.0424199 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M9.7716726,18.9181495 C10.2824199,18.8318861 10.8452669,19.0009964 11.2236299,19.3554448 C11.7839146,19.892669 11.455089,20.9782206 10.6949466,21.1225623 C10.1568683,21.2139502 9.54790036,21.0388612 9.17637011,20.630605 C8.68441281,20.0669039 9.03032028,19.0513879 9.7716726,18.9181495 L9.7716726,18.9181495 Z M9.69395018,19.5305338 C9.39672598,19.6466904 9.34462633,20.1061922 9.62647687,20.271032 C9.93480427,20.4563701 10.3131673,20.5802135 10.6753025,20.5358007 C11.0169395,20.5033452 11.141637,19.9951601 10.855516,19.8055516 C10.532669,19.5621352 10.0911032,19.4519573 9.69395018,19.5305338 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M50.6476868,25.4519573 L114.704626,25.4519573 C114.703772,25.6509609 114.703772,25.8499644 114.704626,26.0498221 L50.6476868,26.0498221 C50.6468327,25.8499644 50.6468327,25.6509609 50.6476868,25.4519573 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M57.1498932,27.1644128 C57.2874021,27.1618505 57.4266192,27.1592883 57.5666904,27.156726 C57.8878292,27.5111744 58.2072598,27.8681851 58.5224199,28.2286121 C58.3182918,28.2234875 58.1056228,28.2636299 57.9066192,28.2149466 C57.7161566,28.0210676 57.5487544,27.8066904 57.3617082,27.6102491 C57.1814947,27.8143772 57.0029893,28.0202135 56.8304626,28.2294662 C56.6220641,28.2337367 56.4145196,28.2345907 56.2078292,28.2328826 C56.5059075,27.8630605 56.8466904,27.5299644 57.1498932,27.1644128 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M69.1917438,27.1644128 C69.3301068,27.1618505 69.4693238,27.1592883 69.609395,27.156726 C69.9305338,27.5120285 70.2508185,27.8681851 70.5651246,28.2294662 C70.3652669,28.2328826 70.1654093,28.2345907 69.9664057,28.237153 C69.7785053,28.0279004 69.5923132,27.8177936 69.4044128,27.6102491 C69.2250534,27.8143772 69.046548,28.0193594 68.8740214,28.2294662 C68.6656228,28.2337367 68.4580783,28.2354448 68.2505338,28.2328826 C68.5486121,27.8630605 68.889395,27.5308185 69.1917438,27.1644128 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M104.2121,28.1346619 C104.419644,28.135516 104.628043,28.135516 104.837295,28.1380783 C104.812527,28.5079004 104.76726,28.9024911 104.528968,29.2039858 C104.370961,29.4269039 104.111317,29.5362278 103.861068,29.6190747 C104.040427,29.9675445 104.157438,30.3493238 104.189893,30.7413523 C104.214662,31.5834875 104.273594,32.4999288 103.785907,33.2361566 C103.120569,34.3832028 101.283416,34.4711744 100.467758,33.4479715 C99.922847,32.7988612 99.830605,31.9114591 99.8716014,31.0966548 C99.8775801,30.3245552 100.127829,29.5029181 100.744484,29.0007117 C101.542206,28.3498932 102.807972,28.4318861 103.535658,29.1544484 C103.696228,29.1006406 103.874733,29.0562278 103.987473,28.9170107 C104.179644,28.7043416 104.175374,28.4011388 104.2121,28.1346619 L104.2121,28.1346619 Z M101.584911,29.2637722 C100.928968,29.4824199 100.647117,30.203274 100.600996,30.8387189 C100.582206,31.5561566 100.529253,32.3402135 100.95032,32.9662633 C101.393594,33.6913879 102.587616,33.738363 103.09153,33.0559431 C103.442562,32.5972954 103.504057,31.993452 103.485267,31.4340214 C103.501495,30.8412811 103.47758,30.1972954 103.11032,29.7010676 C102.782349,29.2253381 102.11274,29.0801423 101.584911,29.2637722 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M99.4274733,28.3225623 C99.6179359,28.3234164 99.8083986,28.3234164 100.000569,28.3242705 C100.00911,28.7837722 99.932242,29.2996441 99.572669,29.6224911 C99.3172954,29.8573665 98.9637011,29.9214235 98.630605,29.953879 C98.6297509,30.7609964 98.630605,31.568968 98.630605,32.3769395 C98.6331673,32.8407117 98.4606406,33.3155872 98.113879,33.6316014 C97.7201423,34.0253381 97.1419217,34.1756584 96.5978648,34.1500356 C95.9854804,34.162847 95.3338078,33.9040569 94.9964413,33.3736655 C94.7829181,33.0533808 94.7145907,32.6630605 94.7188612,32.2846975 C94.7188612,31.0659075 94.7180071,29.8471174 94.7197153,28.6291815 L95.4337367,28.6291815 C95.4362989,29.880427 95.4294662,31.1316726 95.4362989,32.3820641 C95.4303203,32.7869039 95.6156584,33.2173665 95.9871886,33.4112456 C96.4313167,33.6256228 96.9864769,33.6213523 97.4177936,33.3762278 C97.791032,33.1516014 97.9148754,32.6878292 97.910605,32.2778648 C97.9208541,31.061637 97.9148754,29.8445552 97.9131673,28.6283274 C98.1514591,28.6291815 98.390605,28.6291815 98.6297509,28.6300356 C98.630605,28.8982206 98.6297509,29.1664057 98.6297509,29.4345907 C98.8372954,29.3987189 99.0602135,29.3414947 99.2011388,29.1698221 C99.4001423,28.9358007 99.3839146,28.6086833 99.4274733,28.3225623 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M50.6656228,28.6300356 C51.3181495,28.6351601 51.9706762,28.615516 52.6232028,28.6419929 C53.0613523,28.6582206 53.5268327,28.7666904 53.8505338,29.0818505 C54.1605694,29.4012811 54.2425623,29.8778648 54.1904626,30.3066192 C54.1170107,30.7225623 53.796726,31.0556584 53.4158007,31.2162278 C53.648968,31.3024911 53.8864057,31.4135231 54.0444128,31.6133808 C54.4808541,32.1523132 54.4424199,32.991032 54.0179359,33.5248399 C53.7002135,33.9091815 53.1843416,34.0654804 52.7009253,34.0757295 C52.0219217,34.0817082 51.3429181,34.0765836 50.6647687,34.0774377 C50.6656228,32.261637 50.6639146,30.4458363 50.6656228,28.6300356 L50.6656228,28.6300356 Z M51.3984342,29.2424199 C51.4001423,29.8129537 51.3984342,30.3834875 51.3992883,30.9540214 C51.941637,30.9113167 52.5258363,31.0641993 53.0365836,30.8284698 C53.6259075,30.5696797 53.6498221,29.5550178 53.0254804,29.3303915 C52.5002135,29.1672598 51.9382206,29.2697509 51.3984342,29.2424199 L51.3984342,29.2424199 Z M51.3984342,31.5484698 C51.4001423,32.1984342 51.3984342,32.8475445 51.3992883,33.4975089 C51.9672598,33.4641993 52.5659786,33.5888968 53.1100356,33.3762278 C53.5609964,33.194306 53.704484,32.6391459 53.5874733,32.2027046 C53.5276868,31.8269039 53.1553025,31.5723843 52.790605,31.5561566 C52.3268327,31.5356584 51.8622064,31.5527402 51.3984342,31.5484698 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M56.6716014,28.6633452 C57.3275445,28.4558007 58.0928114,28.5548754 58.6411388,28.9827758 C59.3953025,29.5763701 59.5695374,30.608968 59.5140214,31.5151601 C59.5422064,32.2291815 59.3551601,32.9773665 58.8819929,33.526548 C58.0671886,34.4259075 56.4264769,34.3627046 55.7116014,33.3685409 C55.1427758,32.6203559 55.1342349,31.6261922 55.2034164,30.7302491 C55.2768683,29.8496797 55.791032,28.9426335 56.6716014,28.6633452 L56.6716014,28.6633452 Z M56.9893238,29.2347331 C56.5562989,29.3440569 56.2180783,29.6985053 56.0737367,30.1135943 C55.8849822,30.5551601 55.9003559,31.0411388 55.9054804,31.5117438 C55.8849822,32.0412811 55.9866192,32.5981495 56.3051957,33.0337367 C56.7962989,33.719573 57.9886121,33.711032 58.4481139,32.9935943 C58.7769395,32.5135943 58.8145196,31.9071886 58.7991459,31.3434875 C58.8170819,30.7857651 58.7649822,30.1853381 58.4293238,29.7181495 C58.1235587,29.26121 57.5043416,29.095516 56.9893238,29.2347331 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M63.1020641,29.0186477 C63.738363,28.4874021 64.6949466,28.4241993 65.4311744,28.7752313 C66.046121,29.0647687 66.3758007,29.7369395 66.4364413,30.3894662 C66.1947331,30.387758 65.953879,30.387758 65.7130249,30.3903203 C65.6481139,30.0469751 65.5550178,29.6780071 65.2876868,29.4345907 C64.78121,29.0348754 63.9792171,29.0801423 63.5103203,29.5191459 C63.147331,29.8855516 63.0251957,30.4185053 62.9987189,30.9172954 C62.9935943,31.5382206 62.944911,32.1907473 63.2088256,32.7723843 C63.3745196,33.1533096 63.7153025,33.4761566 64.135516,33.5419217 C64.5352313,33.6068327 64.9879004,33.544484 65.3056228,33.2754448 C65.5772242,33.0397153 65.6421352,32.6690391 65.7155872,32.3359431 C65.9572954,32.3376512 66.1990036,32.3385053 66.4415658,32.3402135 C66.360427,32.9338078 66.1050534,33.5641281 65.5558719,33.8664769 C65.0903915,34.1619929 64.5181495,34.1850534 63.9860498,34.1278292 C63.2967972,34.0176512 62.7177224,33.4949466 62.482847,32.8458363 C62.2163701,32.2377224 62.2872598,31.5646975 62.280427,30.9198577 C62.2881139,30.2152313 62.5469039,29.4772954 63.1020641,29.0186477 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M68.7057651,28.6659075 C69.3642705,28.4540925 70.1346619,28.5531673 70.6855516,28.9836299 C71.4098221,29.5575801 71.6088256,30.5474733 71.556726,31.4263345 C71.5951601,32.1856228 71.4106762,32.9944484 70.8871174,33.5675445 C70.0279004,34.4575089 68.3487544,34.3336655 67.6834164,33.2694662 C67.18121,32.528968 67.1820641,31.5886121 67.246121,30.7311032 C67.319573,29.8530961 67.8303203,28.9486121 68.7057651,28.6659075 L68.7057651,28.6659075 Z M69.0380071,29.2330249 C68.603274,29.3406406 68.2607829,29.6959431 68.1164413,30.1135943 C67.9276868,30.5551601 67.9430605,31.0419929 67.9481851,31.5125979 C67.9268327,32.0412811 68.0293238,32.5972954 68.3461922,33.0320285 C68.8364413,33.7187189 70.0304626,33.7118861 70.4899644,32.9944484 C70.8179359,32.5161566 70.8572242,31.9131673 70.8418505,31.3511744 C70.8597865,30.7891815 70.8085409,30.184484 70.4686121,29.7147331 C70.1637011,29.2620641 69.5504626,29.0972242 69.0380071,29.2330249 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M72.6158007,28.6300356 C72.8566548,28.6283274 73.098363,28.6283274 73.3400712,28.6300356 C74.242847,30.0307473 75.1498932,31.4297509 76.0543772,32.8296085 C76.0449822,31.4288968 76.0552313,30.0281851 76.0483986,28.6274733 C76.2866904,28.6291815 76.5258363,28.6291815 76.7658363,28.6300356 C76.7658363,30.4458363 76.7649822,32.261637 76.7658363,34.0774377 C76.5258363,34.0782918 76.2875445,34.0782918 76.0483986,34.0782918 C75.1439146,32.7057651 74.271032,31.311032 73.3554448,29.9461922 C73.3417794,31.3229893 73.3528826,32.7006406 73.3494662,34.0774377 C73.1043416,34.0782918 72.8592171,34.0782918 72.6149466,34.0774377 C72.6149466,32.261637 72.6140925,30.4458363 72.6158007,28.6300356 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M78.2664769,29.4140925 C78.9190036,28.4002847 80.5067616,28.2875445 81.4018505,29.0314591 C81.7486121,29.3346619 81.9219929,29.7881851 81.9920285,30.2331673 C81.7537367,30.2348754 81.5145907,30.2348754 81.277153,30.2348754 C81.1951601,29.9590036 81.1157295,29.6592171 80.8842705,29.4679004 C80.547758,29.1484698 80.0429893,29.1245552 79.6108185,29.205694 C79.1658363,29.3081851 78.8301779,29.6805694 78.7003559,30.1076157 C78.5022064,30.6713167 78.5654093,31.2751601 78.5619929,31.8610676 C78.6038434,32.5272598 78.9318149,33.2737367 79.6159431,33.488968 C80.1676868,33.6444128 80.8347331,33.5760854 81.277153,33.184911 C81.2780071,32.7809253 81.2762989,32.3777936 81.2788612,31.9738078 C80.8620641,31.975516 80.4452669,31.9746619 80.0284698,31.9746619 C80.0276157,31.7705338 80.0276157,31.5664057 80.0293238,31.3622776 L81.9920285,31.3622776 C81.9928826,32.0344484 81.9937367,32.7074733 81.9920285,33.3796441 C81.5649822,33.960427 80.8074021,34.172242 80.1155872,34.1491815 C79.4468327,34.1876157 78.7618505,33.8920996 78.3570107,33.3548754 C77.9410676,32.8082562 77.8052669,32.1019217 77.8232028,31.4280427 C77.8086833,30.7379359 77.871032,30.0017082 78.2664769,29.4140925 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M84.470605,28.6291815 L88.6539502,28.6291815 C88.6539502,28.8333096 88.6539502,29.0374377 88.6548043,29.2415658 C88.0791459,29.2424199 87.5034875,29.2407117 86.9286833,29.2424199 C86.9303915,30.8540925 86.9286833,32.4657651 86.9295374,34.0774377 C86.6844128,34.0782918 86.4392883,34.0782918 86.1950178,34.0774377 C86.1958719,32.4657651 86.1933096,30.8540925 86.1958719,29.2424199 C85.6202135,29.2407117 85.0454093,29.2424199 84.4697509,29.2415658 C84.4688968,29.0374377 84.4688968,28.8333096 84.470605,28.6291815 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M89.4414235,28.6300356 C89.6848399,28.6291815 89.9291103,28.6291815 90.1742349,28.6300356 C90.175089,29.4098221 90.1759431,30.1904626 90.1742349,30.9711032 C91.0753025,30.9728114 91.9763701,30.9711032 92.8782918,30.9719573 C92.8723132,30.1904626 92.88,29.4098221 92.8740214,28.6283274 C93.1123132,28.6291815 93.3514591,28.6291815 93.590605,28.6300356 C93.5923132,30.4458363 93.590605,32.261637 93.5914591,34.0774377 C93.3523132,34.0782918 93.1140214,34.0782918 92.8757295,34.0774377 C92.8765836,33.239573 92.8757295,32.4025623 92.8765836,31.5646975 C91.975516,31.5655516 91.0753025,31.5646975 90.175089,31.5655516 L90.175089,34.0774377 C89.9299644,34.0782918 89.6848399,34.0782918 89.4405694,34.0774377 C89.4414235,32.261637 89.4397153,30.4458363 89.4414235,28.6300356 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M105.32669,28.6300356 C105.567544,28.6283274 105.809253,28.6283274 106.051815,28.6300356 C106.955445,30.0307473 107.861637,31.4297509 108.766121,32.8296085 C108.756726,31.4288968 108.766121,30.0281851 108.760996,28.6274733 C108.998434,28.6291815 109.23758,28.6291815 109.476726,28.6300356 C109.47758,30.4458363 109.476726,32.261637 109.47758,34.0774377 C109.23758,34.0782918 108.998434,34.0782918 108.760142,34.0782918 C107.855658,32.6938078 106.961423,31.3024911 106.059502,29.9162989 C106.063772,31.3033452 106.059502,32.6903915 106.06121,34.0774377 C105.815231,34.0782918 105.570961,34.0782918 105.32669,34.0774377 C105.32669,32.261637 105.325836,30.4458363 105.32669,28.6300356 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M111.028612,29.4679004 C111.647829,28.4241993 113.229609,28.2815658 114.151174,28.9904626 C114.526975,29.2928114 114.716584,29.7676868 114.789181,30.2340214 C114.550036,30.2348754 114.311744,30.2348754 114.07516,30.2348754 C113.992313,29.9598577 113.912883,29.6600712 113.683132,29.4687544 C113.344057,29.1476157 112.835872,29.1245552 112.401993,29.2074021 C111.957865,29.3116014 111.623915,29.685694 111.495801,30.1127402 C111.300214,30.6747331 111.361708,31.2768683 111.36,31.8602135 C111.400996,32.5264057 111.728114,33.2728826 112.412242,33.488968 C112.963986,33.6452669 113.631032,33.5752313 114.073452,33.1857651 C114.07516,32.7817794 114.073452,32.3777936 114.076014,31.9738078 C113.659217,31.975516 113.24242,31.9746619 112.825623,31.9746619 C112.823915,31.7705338 112.824769,31.5664057 112.826477,31.3622776 L114.789181,31.3622776 C114.790036,32.0353025 114.79089,32.7083274 114.788327,33.3813523 C114.360427,33.9612811 113.601993,34.1730961 112.909324,34.1491815 C112.243132,34.1867616 111.561566,33.8929537 111.156726,33.3582918 C110.739075,32.8133808 110.60242,32.1061922 110.620356,31.4323132 C110.605836,30.7609964 110.66306,30.0503915 111.028612,29.4679004 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M57.156726,34.6197865 C57.433452,34.4942349 57.8024199,34.6958007 57.7528826,35.02121 C57.7639858,35.3286833 57.3984342,35.4781495 57.1498932,35.3585765 C56.8535231,35.2372954 56.8560854,34.7308185 57.156726,34.6197865 Z"
                                  ></path>
                                </g>
                                <g
                                  id="#da282dff"
                                  transform="translate(4.868327, 5.039146)"
                                  fill="#DA282D"
                                >
                                  <path
                                    id="Shape"
                                    d="M14.9363701,0.288683274 C18.3980071,-0.249395018 22.0167972,0.286120996 25.1718149,1.81067616 C28.5497509,3.41807829 31.3691103,6.14775801 33.1029181,9.46163701 C32.7954448,9.5769395 32.520427,9.76313167 32.3000712,10.005694 C26.9329537,15.3514591 21.5598577,20.6920996 16.1927402,26.0387189 C13.504911,23.3619929 10.8153737,20.6878292 8.12669039,18.0119573 C7.82946619,17.7352313 7.57238434,17.3927402 7.18548043,17.2355872 C6.5833452,16.965694 5.82747331,17.1014947 5.36113879,17.5703915 C4.81964413,18.1101779 4.27046263,18.6431317 3.73836299,19.1914591 C3.16014235,19.8106762 3.20711744,20.8731673 3.82462633,21.4488256 C7.43487544,25.0445552 11.049395,28.6360142 14.6604982,32.2308897 C14.9346619,32.5033452 15.1977224,32.8108185 15.5683986,32.953452 C16.1517438,33.1823488 16.8725979,33.0653381 17.3184342,32.6101068 C23.1928826,26.7758007 29.0545196,20.9286833 34.9306762,15.0960854 C35.4525267,18.7669751 34.7914591,22.5975801 33.027758,25.8619217 C31.393879,28.9306762 28.8196441,31.4852669 25.7380783,33.0935231 C22.4318861,34.8427046 18.5560142,35.4798577 14.8637722,34.8888256 C10.7777936,34.255089 6.94377224,32.113879 4.27302491,28.9562989 C2.15914591,26.4871174 0.759288256,23.4149466 0.280142349,20.1992883 C-0.238291815,16.7897509 0.281850534,13.2307473 1.76370107,10.1158719 C2.74846975,8.02761566 4.15088968,6.13323843 5.86932384,4.58989324 C8.38718861,2.31373665 11.5806406,0.796868327 14.9363701,0.288683274 L14.9363701,0.288683274 Z M17.8829893,4.14491103 C17.1860498,4.43530249 17.0792883,5.37053381 17.3227046,6.00170819 C17.575516,6.68412811 18.5679715,6.84982206 19.0633452,6.34078292 C19.4511032,5.92483986 19.4724555,5.28341637 19.3212811,4.76412811 C19.1376512,4.1833452 18.4287544,3.90918149 17.8829893,4.14491103 L17.8829893,4.14491103 Z M19.9447687,4.13380783 C20.067758,4.99814947 20.1676868,5.86590747 20.2753025,6.7319573 C20.492242,6.78661922 20.7117438,6.83017794 20.9312456,6.87202847 C21.3685409,6.10846975 21.8169395,5.35088968 22.2439858,4.58135231 C22.0202135,4.5369395 21.7972954,4.4916726 21.5735231,4.44811388 C21.3019217,5.01523132 21.0072598,5.57039146 20.7382206,6.13921708 C20.713452,5.5088968 20.6519573,4.8802847 20.6118149,4.2516726 C20.390605,4.20384342 20.1676868,4.16967972 19.9447687,4.13380783 L19.9447687,4.13380783 Z M15.0158007,4.43017794 C14.5682562,4.68725979 14.4640569,5.27060498 14.5802135,5.73864769 C14.64,6.1947331 14.9022064,6.68241993 15.3796441,6.80199288 C15.9032028,6.90875445 16.4780071,6.71145907 16.8247687,6.30405694 C16.7641281,5.95814947 16.6975089,5.61309609 16.624911,5.26975089 C16.2918149,5.33295374 15.9578648,5.39786477 15.6247687,5.46362989 C15.646121,5.60113879 15.6683274,5.73864769 15.6896797,5.87701068 C15.8323132,5.85480427 15.9749466,5.83174377 16.1175801,5.81124555 C16.1423488,5.95046263 16.1594306,6.09053381 16.1730961,6.23145907 C15.9826335,6.29637011 15.7767972,6.40227758 15.5735231,6.32199288 C15.3642705,6.22377224 15.277153,5.99487544 15.2250534,5.78562278 C15.1644128,5.52 15.1071886,5.23302491 15.2054093,4.96911032 C15.3104626,4.77010676 15.5359431,4.7316726 15.7409253,4.73338078 C15.8442705,4.82135231 15.9330961,4.92384342 16.0022776,5.04085409 C16.1961566,5.01608541 16.3883274,4.97765125 16.5770819,4.92640569 C16.4882562,4.72398577 16.3883274,4.50960854 16.1918861,4.39003559 C15.8365836,4.18761566 15.3659786,4.2405694 15.0158007,4.43017794 L15.0158007,4.43017794 Z M23.4422776,5.0288968 C23.3269751,5.88896797 23.2347331,6.75160142 23.1117438,7.61081851 C23.3098932,7.71160142 23.5088968,7.81067616 23.7079004,7.90975089 C24.3313879,7.28455516 24.94121,6.64740214 25.5578648,6.01622776 C25.3528826,5.91288256 25.1453381,5.81380783 24.9369395,5.71900356 C24.5320996,6.19217082 24.1246975,6.66362989 23.7130249,7.13081851 C23.8402847,6.52185053 23.9385053,5.90604982 24.0572242,5.29537367 C23.8573665,5.19459075 23.6575089,5.09039146 23.4422776,5.0288968 L23.4422776,5.0288968 Z M11.0135231,5.95729537 C11.381637,6.7080427 11.7454804,7.46049822 12.1229893,8.206121 C12.637153,7.95160142 13.1564413,7.70818505 13.6697509,7.44939502 C13.5997153,7.30846975 13.5305338,7.16754448 13.4604982,7.02661922 C13.1222776,7.17608541 12.794306,7.34775801 12.46121,7.51003559 C12.3758007,7.3375089 12.2903915,7.1658363 12.2049822,6.99330961 C12.4859786,6.85153025 12.7678292,6.71145907 13.0488256,6.57053381 C12.9822064,6.43558719 12.9155872,6.29978648 12.848968,6.16483986 C12.5645552,6.30576512 12.276726,6.43900356 11.9914591,6.57907473 C11.9103203,6.42790036 11.8454093,6.26989324 11.7822064,6.11103203 C12.1170107,5.95046263 12.4552313,5.79758007 12.784911,5.62590747 C12.7123132,5.48412811 12.6405694,5.34149466 12.5696797,5.1997153 C12.0469751,5.44398577 11.5430605,5.72669039 11.0135231,5.95729537 L11.0135231,5.95729537 Z M9.83060498,6.75074733 C10.1440569,7.15985765 10.4429893,7.58007117 10.7590036,7.9883274 C10.2217794,7.73551601 9.67430605,7.50918149 9.1319573,7.27003559 C8.97224199,7.39302491 8.81081851,7.51345196 8.64854093,7.63217082 C9.14903915,8.29836299 9.64185053,8.9713879 10.1432028,9.63758007 C10.3029181,9.51288256 10.4643416,9.39074733 10.6291815,9.27202847 C10.3276868,8.8569395 10.0236299,8.44355872 9.70932384,8.03871886 C10.246548,8.27871886 10.7888968,8.51017794 11.326121,8.75103203 C11.4875445,8.62975089 11.648968,8.50846975 11.8103915,8.38718861 C11.3192883,7.71843416 10.8162278,7.05822064 10.3225623,6.39117438 C10.1568683,6.50818505 9.99202847,6.62775801 9.83060498,6.75074733 L9.83060498,6.75074733 Z M26.1463345,6.40227758 C25.6535231,7.07017794 25.1496085,7.72868327 24.6567972,8.39572954 C24.8165125,8.52298932 24.97879,8.64768683 25.1436299,8.76896797 C25.449395,8.35131673 25.7671174,7.94220641 26.0720285,7.52284698 C25.9720996,8.10192171 25.9345196,8.68953737 25.8320285,9.2686121 C25.9883274,9.4052669 26.1540214,9.53081851 26.3231317,9.65209964 C26.8236299,8.98419929 27.3258363,8.31715302 27.8246263,7.64839858 C27.6597865,7.5313879 27.4975089,7.41181495 27.3386477,7.28797153 C27.0286121,7.69793594 26.7125979,8.10448399 26.4179359,8.52469751 C26.4871174,7.93964413 26.5674021,7.35544484 26.6382918,6.76953737 C26.4768683,6.64313167 26.3137367,6.52014235 26.1463345,6.40227758 L26.1463345,6.40227758 Z M21.8075445,6.61580071 C21.5572954,6.66619217 21.5342349,7.08811388 21.7836299,7.16071174 C21.9843416,7.31103203 22.2875445,7.10177936 22.2559431,6.86604982 C22.2158007,6.66533808 21.9937367,6.56882562 21.8075445,6.61580071 L21.8075445,6.61580071 Z M14.1283986,6.70377224 C13.9285409,6.73366548 13.7568683,6.94633452 13.8610676,7.14448399 C13.9584342,7.38875445 14.3162989,7.34177936 14.4358719,7.1427758 C14.5887544,6.94718861 14.3564413,6.64142349 14.1283986,6.70377224 L14.1283986,6.70377224 Z M7.67060498,8.57850534 C8.25395018,9.1772242 8.84071174,9.77338078 9.44626335,10.3498932 C9.58462633,10.2098221 9.72298932,10.070605 9.86220641,9.9313879 C9.27202847,9.33950178 8.68185053,8.74846975 8.08996441,8.15914591 C7.94989324,8.29836299 7.80982206,8.43758007 7.67060498,8.57850534 L7.67060498,8.57850534 Z M6.22206406,10.2704626 C6.86946619,10.7965836 7.53224199,11.3030605 8.18903915,11.8172242 C8.53067616,11.3824911 8.86975089,10.9451957 9.21395018,10.5130249 C9.08839858,10.4156584 8.9602847,10.3217082 8.82960854,10.2311744 C8.61523132,10.5010676 8.40854093,10.7777936 8.18647687,11.0434164 C7.66035587,10.6223488 7.12740214,10.2098221 6.59786477,9.79302491 C6.47231317,9.95188612 6.34676157,10.1107473 6.22206406,10.2704626 L6.22206406,10.2704626 Z M5.72156584,11.003274 C5.63188612,11.1851957 5.53964413,11.3662633 5.44313167,11.5456228 C5.8966548,11.7813523 6.35103203,12.0179359 6.79772242,12.267331 C6.21010676,12.2579359 5.6233452,12.3125979 5.03572954,12.3202847 C4.94007117,12.4970819 4.846121,12.6747331 4.75558719,12.8549466 C5.49523132,13.2375801 6.22291815,13.6424199 6.96854093,14.0139502 C7.06505338,13.8354448 7.15900356,13.6552313 7.25380783,13.4758719 C6.79430605,13.236726 6.33480427,12.9975801 5.87701068,12.7541637 C6.47231317,12.7686833 7.06505338,12.7054804 7.66035587,12.7037722 C7.75857651,12.5278292 7.84740214,12.3459075 7.93537367,12.1639858 C7.19487544,11.7813523 6.46035587,11.3876157 5.72156584,11.003274 L5.72156584,11.003274 Z M4.9033452,13.8790036 C4.16199288,14.012242 3.81608541,15.027758 4.3080427,15.5914591 C4.67957295,15.9997153 5.28854093,16.1748043 5.82661922,16.0834164 C6.58676157,15.9390747 6.91558719,14.8535231 6.35530249,14.3162989 C5.9769395,13.9618505 5.41409253,13.7927402 4.9033452,13.8790036 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M35.6156584,3.92882562 C60.6986477,3.92882562 85.7807829,3.92797153 110.862918,3.92882562 C111.778505,3.92967972 112.692384,4.23117438 113.423488,4.78377224 C114.433025,5.52854093 115.065907,6.73879004 115.131673,7.98918149 L115.131673,27.1917438 C115.065907,28.5702491 114.298078,29.8906762 113.120285,30.6132384 C112.422491,31.052242 111.596584,31.2725979 110.774947,31.2606406 C85.6577936,31.2580783 60.5406406,31.2614947 35.4234875,31.2589324 C36.9958719,29.2253381 38.2240569,26.9244128 39.0209253,24.48 C40.2200712,20.8475445 40.4617794,16.9059075 39.7246975,13.1521708 C39.0772954,9.81950178 37.66121,6.63886121 35.6156584,3.92882562 L35.6156584,3.92882562 Z M71.8590747,5.0741637 C71.8641993,5.73523132 72.1998577,6.44241993 72.8566548,6.67302491 C73.5117438,6.89765125 74.2505338,6.8916726 74.9133096,6.69779359 C75.6085409,6.49622776 76.0355872,5.77879004 76.0039858,5.0741637 C75.5991459,5.07160142 75.1951601,5.07245552 74.7911744,5.07330961 C74.7553025,5.30818505 74.7108897,5.60113879 74.4597865,5.69850534 C74.1241281,5.83174377 73.7295374,5.83772242 73.3947331,5.69935943 C73.1479004,5.59601423 73.1111744,5.30391459 73.0744484,5.07330961 C72.6687544,5.07330961 72.2639146,5.07160142 71.8590747,5.0741637 L71.8590747,5.0741637 Z M107.139075,5.12626335 C106.722278,5.69850534 106.300356,6.26647687 105.887829,6.84042705 C106.347331,6.84298932 106.807687,6.84213523 107.268897,6.84128114 C107.897509,6.27074733 108.522705,5.69594306 109.153025,5.12626335 C108.480854,5.12455516 107.809537,5.12284698 107.139075,5.12626335 L107.139075,5.12626335 Z M53.6720285,6.23914591 C54.0008541,6.433879 54.3296797,6.62775801 54.6593594,6.82163701 C54.8703203,6.35957295 55.4579359,6.2741637 55.8858363,6.46377224 C56.3863345,6.67302491 56.9269751,6.90362989 57.479573,6.76014235 C58.043274,6.66960854 58.4780071,6.23231317 58.6812811,5.71558719 C58.3533096,5.52427046 58.0261922,5.33124555 57.6999288,5.13565836 C57.4864057,5.5772242 56.9312456,5.68398577 56.5067616,5.50718861 C55.9789324,5.29451957 55.412669,5.04 54.8344484,5.20740214 C54.286121,5.30476868 53.8753025,5.73864769 53.6720285,6.23914591 L53.6720285,6.23914591 Z M54.6935231,7.29224199 C53.9974377,10.9144484 53.3201423,14.5392171 52.6274733,18.1614235 C53.2458363,18.1605694 53.8650534,18.1716726 54.4834164,18.1580071 C54.645694,17.5217082 54.7268327,16.8503915 54.8498221,16.199573 C55.6723132,16.1987189 56.4948043,16.1987189 57.3181495,16.199573 C57.4385765,16.8538078 57.5453381,17.510605 57.6725979,18.1639858 C58.3550178,18.1622776 59.0382918,18.1639858 59.7215658,18.1631317 C59.0442705,14.538363 58.3481851,10.9170107 57.664911,7.29309609 C56.6741637,7.29309609 55.6834164,7.29480427 54.6935231,7.29224199 L54.6935231,7.29224199 Z M86.5400712,8.38718861 C86.0549466,9.1430605 86.1420641,10.0774377 86.1360854,10.9332384 C86.1369395,12.4697509 86.1352313,14.0062633 86.1369395,15.5419217 C86.1403559,16.2337367 86.3000712,16.9742349 86.8014235,17.4824199 C87.3813523,18.0956584 88.2679004,18.2818505 89.0818505,18.2784342 C89.9094662,18.2980783 90.8130961,18.1503203 91.4382918,17.5618505 C91.9712456,17.0733096 92.1719573,16.329395 92.1813523,15.627331 C92.1941637,14.4606406 92.1830605,13.2948043 92.1864769,12.128968 C91.2384342,12.1272598 90.2895374,12.1281139 89.3414947,12.1281139 C89.3414947,12.6431317 89.3406406,13.1590036 89.3423488,13.6740214 C89.6455516,13.6748754 89.9496085,13.6748754 90.2545196,13.6748754 C90.2511032,14.326548 90.2562278,14.9782206 90.2519573,15.6307473 C90.2476868,15.9211388 90.2237722,16.2491103 90.0051246,16.4669039 C89.7360854,16.7162989 89.3406406,16.7564413 88.9921708,16.7145907 C88.725694,16.6821352 88.4421352,16.5625623 88.3080427,16.3174377 C88.1483274,16.0287544 88.1850534,15.6871174 88.1773665,15.3702491 C88.1893238,13.4570819 88.1585765,11.5422064 88.1927402,9.62903915 C88.2175089,8.57423488 90.0632028,8.50761566 90.2203559,9.51800712 C90.2844128,10.0202135 90.24,10.5292527 90.2545196,11.0340214 C90.8976512,11.0357295 91.541637,11.0357295 92.1864769,11.0340214 C92.1728114,10.3088968 92.2505338,9.55814947 92.0088256,8.86035587 C91.8175089,8.28640569 91.3759431,7.8055516 90.8233452,7.56128114 C90.1178648,7.23928826 89.3209964,7.22733096 88.5617082,7.28370107 C87.7785053,7.35715302 86.9662633,7.69451957 86.5400712,8.38718861 L86.5400712,8.38718861 Z M45.6469751,7.34604982 C45.6478292,8.93978648 45.6469751,10.5335231 45.6469751,12.1272598 C45.4266192,12.1281139 45.2062633,12.1281139 44.9867616,12.128968 C44.9867616,12.5867616 44.9859075,13.0454093 44.9876157,13.5032028 C45.2071174,13.5040569 45.4274733,13.5040569 45.6478292,13.5040569 C45.646121,15.0661922 45.6478292,16.6291815 45.6469751,18.1913167 C46.8008541,18.1913167 47.9547331,18.1955872 49.1094662,18.1896085 C49.8892527,18.1708185 50.7382206,17.9735231 51.277153,17.3671174 C51.7622776,16.8281851 51.8818505,16.0731673 51.8792883,15.3719573 C51.8784342,13.6082562 51.8809964,11.8445552 51.8775801,10.08 C51.8741637,9.406121 51.7417794,8.686121 51.2762989,8.17024911 C50.7373665,7.56384342 49.8883986,7.36654804 49.107758,7.34775801 C47.953879,7.34177936 46.8,7.34604982 45.6469751,7.34604982 L45.6469751,7.34604982 Z M63.4975089,7.34604982 C63.498363,8.93978648 63.4975089,10.5335231 63.4975089,12.1272598 C63.277153,12.1281139 63.0567972,12.1281139 62.8372954,12.128968 C62.8364413,12.5867616 62.8364413,13.0445552 62.8381495,13.5032028 C63.0576512,13.5040569 63.277153,13.5040569 63.498363,13.5040569 C63.4975089,15.0696085 63.4975089,16.634306 63.498363,18.1998577 C64.5676868,18.2007117 65.6378648,18.2066904 66.7080427,18.1972954 C67.4160854,18.1947331 68.1642705,18.0990747 68.7629893,17.6899644 C69.2327402,17.372242 69.5316726,16.8495374 69.6452669,16.30121 C69.7588612,15.7434875 69.7246975,15.1712456 69.7298221,14.6049822 C69.728968,13.0975089 69.7315302,11.5900356 69.728968,10.0834164 C69.7246975,9.40782918 69.5923132,8.68697509 69.1268327,8.16939502 C68.5896085,7.5655516 67.7440569,7.36740214 66.9668327,7.34775801 C65.8103915,7.34177936 64.6539502,7.34604982 63.4975089,7.34604982 L63.4975089,7.34604982 Z M72.4552313,7.34519573 C71.7642705,10.9622776 71.0835587,14.5819217 70.393452,18.1998577 C71.0195018,18.203274 71.6446975,18.2007117 72.2707473,18.2015658 C72.3834875,17.5464769 72.5064769,16.8939502 72.6149466,16.2388612 C73.4365836,16.2345907 74.2590747,16.2380071 75.0815658,16.2380071 C75.1994306,16.892242 75.3087544,17.5481851 75.434306,18.2007117 C76.116726,18.2015658 76.8,18.2024199 77.4824199,18.2007117 C76.8085409,14.5810676 76.1107473,10.9648399 75.4325979,7.34604982 C74.4392883,7.34434164 73.4468327,7.34604982 72.4552313,7.34519573 L72.4552313,7.34519573 Z M78.4296085,7.34604982 C78.4304626,10.9639858 78.4296085,14.5827758 78.4304626,18.2007117 C79.0411388,18.2015658 79.652669,18.2024199 80.2641993,18.2007117 C80.2633452,15.5914591 80.2684698,12.9822064 80.261637,10.3738078 C81.0892527,12.9847687 81.9288256,15.5923132 82.7641281,18.2007117 C83.4525267,18.1981495 84.1426335,18.2092527 84.8318861,18.1964413 C84.8899644,18.0990747 84.8438434,17.9641281 84.8600712,17.8539502 C84.8558007,14.3513167 84.858363,10.8486833 84.858363,7.34604982 C84.2511032,7.34434164 83.6438434,7.34519573 83.0374377,7.34604982 C83.0374377,9.48640569 83.0382918,11.6276157 83.0374377,13.7679715 C82.3498932,11.6284698 81.6666192,9.48640569 80.9841993,7.34519573 C80.132669,7.34519573 79.2811388,7.34434164 78.4296085,7.34604982 L78.4296085,7.34604982 Z M96.3800712,7.34604982 C96.3809253,10.9639858 96.3800712,14.5819217 96.3800712,18.1998577 C97.0624911,18.203274 97.744911,18.2015658 98.427331,18.2007117 C98.4341637,17.0878292 98.4153737,15.9749466 98.4358719,14.8629181 C98.612669,14.5246975 98.8449822,14.2172242 99.0354448,13.8849822 C99.6854093,15.3249822 100.339644,16.7624199 100.993879,18.2007117 C101.691673,18.2024199 102.39032,18.2024199 103.089822,18.1998577 C102.156299,16.1901779 101.210819,14.1856228 100.279858,12.175089 C101.220214,10.5676868 102.151174,8.95516014 103.08726,7.34604982 C102.40484,7.34434164 101.723274,7.34519573 101.042562,7.34604982 C100.171388,8.91245552 99.2848399,10.4703203 98.4239146,12.0427046 C98.4316014,10.477153 98.4256228,8.91160142 98.427331,7.34519573 C97.744911,7.34519573 97.0624911,7.34434164 96.3800712,7.34604982 L96.3800712,7.34604982 Z M103.322989,7.34775801 C104.113025,9.60085409 104.909039,11.852242 105.700783,14.1053381 C105.772527,14.3231317 105.885267,14.538363 105.87331,14.7749466 C105.869893,15.9168683 105.870747,17.05879 105.871601,18.2007117 C106.554021,18.2015658 107.235587,18.203274 107.918007,18.1998577 C107.934235,16.9776512 107.886406,15.7503203 107.941922,14.5306762 C108.77637,12.1332384 109.6279,9.74177936 110.466619,7.34519573 C109.816655,7.34519573 109.16669,7.34434164 108.516726,7.34604982 C108.008541,8.98590747 107.493523,10.6232028 106.985338,12.2630605 C106.481423,10.6214947 105.964698,8.98505338 105.452242,7.34604982 C104.742491,7.34519573 104.03274,7.34348754 103.322989,7.34775801 L103.322989,7.34775801 Z M45.7793594,20.4128114 C45.7785053,20.6118149 45.7785053,20.8108185 45.7793594,21.0106762 L109.836299,21.0106762 C109.835445,20.8108185 109.835445,20.6118149 109.836299,20.4128114 L45.7793594,20.4128114 L45.7793594,20.4128114 Z M52.2815658,22.1252669 C51.978363,22.4908185 51.6375801,22.8239146 51.3395018,23.1937367 C51.5461922,23.1954448 51.7537367,23.1945907 51.9621352,23.1903203 C52.1346619,22.9810676 52.3131673,22.7752313 52.4933808,22.5711032 C52.680427,22.7675445 52.8478292,22.9819217 53.0382918,23.1758007 C53.2372954,23.224484 53.4499644,23.1843416 53.6540925,23.1894662 C53.3389324,22.8290391 53.0195018,22.4720285 52.698363,22.1175801 C52.5582918,22.1201423 52.4190747,22.1227046 52.2815658,22.1252669 L52.2815658,22.1252669 Z M64.3234164,22.1252669 C64.0210676,22.4916726 63.6802847,22.8239146 63.3822064,23.1937367 C63.5897509,23.1962989 63.7972954,23.1945907 64.005694,23.1903203 C64.1782206,22.9802135 64.356726,22.7752313 64.5360854,22.5711032 C64.7239858,22.7786477 64.9101779,22.9887544 65.0980783,23.1980071 C65.2970819,23.1954448 65.4969395,23.1937367 65.6967972,23.1903203 C65.3824911,22.8290391 65.0622064,22.4728826 64.7410676,22.1175801 C64.6009964,22.1201423 64.4617794,22.1227046 64.3234164,22.1252669 L64.3234164,22.1252669 Z M99.3437722,23.095516 C99.3070463,23.3619929 99.3113167,23.6651957 99.1191459,23.8778648 C99.0064057,24.0170819 98.8279004,24.0614947 98.667331,24.1153025 C97.9396441,23.3927402 96.673879,23.3107473 95.8761566,23.9615658 C95.2595018,24.4637722 95.0092527,25.2854093 95.003274,26.0575089 C94.9622776,26.8723132 95.0545196,27.7597153 95.5994306,28.4088256 C96.415089,29.4320285 98.252242,29.3440569 98.9175801,28.1970107 C99.4052669,27.4607829 99.3463345,26.5443416 99.3215658,25.7022064 C99.2891103,25.3101779 99.1720996,24.9283986 98.9927402,24.5799288 C99.2429893,24.4970819 99.5026335,24.387758 99.6606406,24.1648399 C99.8989324,23.8633452 99.9441993,23.4687544 99.968968,23.0989324 C99.7597153,23.0963701 99.5513167,23.0963701 99.3437722,23.095516 L99.3437722,23.095516 Z M94.5591459,23.2834164 C94.5155872,23.5695374 94.5318149,23.8966548 94.3328114,24.1306762 C94.1918861,24.3023488 93.968968,24.359573 93.7614235,24.3954448 C93.7614235,24.1272598 93.7622776,23.8590747 93.7614235,23.5908897 C93.5222776,23.5900356 93.2831317,23.5900356 93.0448399,23.5891815 C93.046548,24.8054093 93.0525267,26.0224911 93.0422776,27.2387189 C93.046548,27.6486833 92.9227046,28.1124555 92.5494662,28.3370819 C92.1181495,28.5822064 91.5629893,28.5864769 91.1188612,28.3720996 C90.747331,28.1782206 90.5619929,27.747758 90.5679715,27.3429181 C90.5611388,26.0925267 90.5679715,24.8412811 90.5654093,23.5900356 L89.8513879,23.5900356 C89.8496797,24.8079715 89.8505338,26.0267616 89.8505338,27.2455516 C89.8462633,27.6239146 89.9145907,28.0142349 90.1281139,28.3345196 C90.4654804,28.864911 91.117153,29.1237011 91.7295374,29.1108897 C92.2735943,29.1365125 92.8518149,28.9861922 93.2455516,28.5924555 C93.5923132,28.2764413 93.7648399,27.8015658 93.7622776,27.3377936 C93.7622776,26.5298221 93.7614235,25.7218505 93.7622776,24.9147331 C94.0953737,24.8822776 94.448968,24.8182206 94.7043416,24.5833452 C95.0639146,24.2604982 95.1407829,23.7446263 95.132242,23.2851246 C94.9400712,23.2842705 94.7496085,23.2842705 94.5591459,23.2834164 L94.5591459,23.2834164 Z M45.7972954,23.5908897 C45.7955872,25.4066904 45.7972954,27.2224911 45.7964413,29.0382918 C46.4745907,29.0374377 47.1535943,29.0425623 47.8325979,29.0365836 C48.3160142,29.0263345 48.8318861,28.8700356 49.1496085,28.485694 C49.5740925,27.9518861 49.6125267,27.1131673 49.1760854,26.5742349 C49.0180783,26.3743772 48.7806406,26.2633452 48.5474733,26.1770819 C48.9283986,26.0165125 49.2486833,25.6834164 49.3221352,25.2674733 C49.3742349,24.8387189 49.292242,24.3621352 48.9822064,24.0427046 C48.6585053,23.7275445 48.1930249,23.6190747 47.7548754,23.602847 C47.1023488,23.5763701 46.4498221,23.5960142 45.7972954,23.5908897 L45.7972954,23.5908897 Z M51.803274,23.6241993 C50.9227046,23.9034875 50.4085409,24.8105338 50.335089,25.6911032 C50.2659075,26.5870463 50.2744484,27.58121 50.843274,28.329395 C51.5581495,29.3235587 53.1988612,29.3867616 54.0136655,28.4874021 C54.4868327,27.9382206 54.673879,27.1900356 54.645694,26.4760142 C54.70121,25.5698221 54.5269751,24.5372242 53.7728114,23.9436299 C53.224484,23.5157295 52.4592171,23.4166548 51.803274,23.6241993 L51.803274,23.6241993 Z M58.2337367,23.9795018 C57.6785765,24.4381495 57.4197865,25.1760854 57.4120996,25.8807117 C57.4189324,26.5255516 57.3480427,27.1985765 57.6145196,27.8066904 C57.849395,28.4558007 58.4284698,28.9785053 59.1177224,29.0886833 C59.6498221,29.1459075 60.2220641,29.122847 60.6875445,28.827331 C61.236726,28.5249822 61.4920996,27.8946619 61.5732384,27.3010676 C61.3306762,27.2993594 61.088968,27.2985053 60.8472598,27.2967972 C60.7738078,27.6298932 60.7088968,28.0005694 60.4372954,28.2362989 C60.119573,28.5053381 59.6669039,28.5676868 59.2671886,28.5027758 C58.8469751,28.4370107 58.5061922,28.1141637 58.3404982,27.7332384 C58.0765836,27.1516014 58.1252669,26.4990747 58.1303915,25.8781495 C58.1568683,25.3793594 58.2790036,24.8464057 58.6419929,24.48 C59.1108897,24.0409964 59.9128826,23.9957295 60.4193594,24.3954448 C60.6866904,24.6388612 60.7797865,25.0078292 60.8446975,25.3511744 C61.0855516,25.3486121 61.3264057,25.3486121 61.5681139,25.3503203 C61.5074733,24.6977936 61.1777936,24.0256228 60.562847,23.7360854 C59.8266192,23.3850534 58.8700356,23.4482562 58.2337367,23.9795018 L58.2337367,23.9795018 Z M63.8374377,23.6267616 C62.9619929,23.9094662 62.4512456,24.8139502 62.3777936,25.6919573 C62.3137367,26.5494662 62.3128826,27.4898221 62.815089,28.2303203 C63.480427,29.2945196 65.159573,29.418363 66.01879,28.5283986 C66.5423488,27.9553025 66.7268327,27.1464769 66.6883986,26.3871886 C66.7404982,25.5083274 66.5414947,24.5184342 65.8172242,23.944484 C65.2663345,23.5140214 64.4959431,23.4149466 63.8374377,23.6267616 L63.8374377,23.6267616 Z M67.7474733,23.5908897 C67.7457651,25.4066904 67.7466192,27.2224911 67.7466192,29.0382918 C67.9908897,29.0391459 68.2360142,29.0391459 68.4811388,29.0382918 C68.4845552,27.6614947 68.473452,26.2838434 68.4871174,24.9070463 C69.4027046,26.2718861 70.2755872,27.6666192 71.1800712,29.0391459 C71.4192171,29.0391459 71.6575089,29.0391459 71.8975089,29.0382918 C71.8966548,27.2224911 71.8975089,25.4066904 71.8975089,23.5908897 C71.6575089,23.5900356 71.418363,23.5900356 71.1800712,23.5883274 C71.1869039,24.9890391 71.1766548,26.3897509 71.1860498,27.7904626 C70.2815658,26.390605 69.3745196,24.9916014 68.4717438,23.5908897 C68.2300356,23.5891815 67.9883274,23.5891815 67.7474733,23.5908897 L67.7474733,23.5908897 Z M73.3981495,24.3749466 C73.0027046,24.9625623 72.9403559,25.69879 72.9548754,26.3888968 C72.9369395,27.0627758 73.0727402,27.7691103 73.4886833,28.3157295 C73.8935231,28.8529537 74.5785053,29.1484698 75.2472598,29.1100356 C75.9390747,29.1330961 76.6966548,28.9212811 77.1237011,28.3404982 C77.1254093,27.6683274 77.1245552,26.9953025 77.1237011,26.3231317 L75.1609964,26.3231317 C75.1592883,26.5272598 75.1592883,26.7313879 75.1601423,26.935516 C75.5769395,26.935516 75.9937367,26.9363701 76.4105338,26.9346619 C76.4079715,27.3386477 76.4096797,27.7417794 76.4088256,28.1457651 C75.9664057,28.5369395 75.2993594,28.6052669 74.7476157,28.4498221 C74.0634875,28.2345907 73.735516,27.4881139 73.6936655,26.8219217 C73.6970819,26.2360142 73.633879,25.6321708 73.8320285,25.0684698 C73.9618505,24.6414235 74.2975089,24.2690391 74.7424911,24.166548 C75.1746619,24.0854093 75.6794306,24.1093238 76.0159431,24.4287544 C76.2474021,24.6200712 76.3268327,24.9198577 76.4088256,25.1957295 C76.6462633,25.1957295 76.8854093,25.1957295 77.1237011,25.1940214 C77.0536655,24.7490391 76.8802847,24.295516 76.5335231,23.9923132 C75.6384342,23.2483986 74.0506762,23.3611388 73.3981495,24.3749466 L73.3981495,24.3749466 Z M79.6022776,23.5900356 C79.6005694,23.7941637 79.6005694,23.9982918 79.6014235,24.2024199 C80.1770819,24.203274 80.7518861,24.2015658 81.3275445,24.203274 C81.3249822,25.8149466 81.3275445,27.4266192 81.3266904,29.0382918 C81.5709609,29.0391459 81.8160854,29.0391459 82.06121,29.0382918 C82.0603559,27.4266192 82.0620641,25.8149466 82.0603559,24.203274 C82.6351601,24.2015658 83.2108185,24.203274 83.7864769,24.2024199 C83.7856228,23.9982918 83.7856228,23.7941637 83.7856228,23.5900356 L79.6022776,23.5900356 L79.6022776,23.5900356 Z M84.5730961,23.5908897 C84.5713879,25.4066904 84.5730961,27.2224911 84.572242,29.0382918 C84.8165125,29.0391459 85.061637,29.0391459 85.3067616,29.0382918 L85.3067616,26.5264057 C86.2069751,26.5255516 87.1071886,26.5264057 88.0082562,26.5255516 C88.0074021,27.3634164 88.0082562,28.200427 88.0074021,29.0382918 C88.245694,29.0391459 88.4839858,29.0391459 88.7231317,29.0382918 C88.7222776,27.2224911 88.7239858,25.4066904 88.7222776,23.5908897 C88.4831317,23.5900356 88.2439858,23.5900356 88.005694,23.5891815 C88.0116726,24.3706762 88.0039858,25.1513167 88.0099644,25.9328114 C87.1080427,25.9319573 86.2069751,25.9336655 85.3059075,25.9319573 C85.3076157,25.1513167 85.3067616,24.3706762 85.3059075,23.5908897 C85.0607829,23.5900356 84.8165125,23.5900356 84.5730961,23.5908897 L84.5730961,23.5908897 Z M100.458363,23.5908897 C100.457509,25.4066904 100.458363,27.2224911 100.458363,29.0382918 C100.702633,29.0391459 100.946904,29.0391459 101.192883,29.0382918 C101.191174,27.6512456 101.195445,26.2641993 101.191174,24.877153 C102.093096,26.2633452 102.987331,27.6546619 103.891815,29.0391459 C104.130107,29.0391459 104.369253,29.0391459 104.609253,29.0382918 C104.608399,27.2224911 104.609253,25.4066904 104.608399,23.5908897 C104.369253,23.5900356 104.130107,23.5900356 103.892669,23.5883274 C103.897794,24.9890391 103.888399,26.3897509 103.897794,27.7904626 C102.99331,26.390605 102.087117,24.9916014 101.183488,23.5908897 C100.940925,23.5891815 100.699217,23.5891815 100.458363,23.5908897 L100.458363,23.5908897 Z M106.160285,24.4287544 C105.794733,25.0112456 105.737509,25.7218505 105.752028,26.3931673 C105.734093,27.0670463 105.870747,27.7742349 106.288399,28.3191459 C106.693238,28.8538078 107.374804,29.1476157 108.040996,29.1100356 C108.733665,29.1339502 109.4921,28.9221352 109.92,28.3422064 C109.922562,27.6691815 109.921708,26.9961566 109.920854,26.3231317 L107.958149,26.3231317 C107.956441,26.5272598 107.955587,26.7313879 107.957295,26.935516 C108.374093,26.935516 108.79089,26.9363701 109.207687,26.9346619 C109.205125,27.3386477 109.206833,27.7426335 109.205125,28.1466192 C108.762705,28.5360854 108.095658,28.606121 107.543915,28.4498221 C106.859786,28.2337367 106.532669,27.4872598 106.491673,26.8210676 C106.493381,26.2377224 106.431886,25.6355872 106.627473,25.0735943 C106.755587,24.646548 107.089537,24.2724555 107.533665,24.1682562 C107.967544,24.0854093 108.47573,24.1084698 108.814804,24.4296085 C109.044555,24.6209253 109.123986,24.9207117 109.206833,25.1957295 C109.443416,25.1957295 109.681708,25.1957295 109.920854,25.1948754 C109.848256,24.7285409 109.658648,24.2536655 109.282847,23.9513167 C108.361281,23.2424199 106.779502,23.3850534 106.160285,24.4287544 L106.160285,24.4287544 Z M52.2883986,29.5806406 C51.987758,29.6916726 51.9851957,30.1981495 52.2815658,30.3194306 C52.5301068,30.4390036 52.8956584,30.2895374 52.8845552,29.9820641 C52.9340925,29.6566548 52.5651246,29.455089 52.2883986,29.5806406 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M18.1503203,4.57793594 C18.3570107,4.50362989 18.6158007,4.58049822 18.6977936,4.79743772 C18.8353025,5.13736655 18.8173665,5.5319573 18.6969395,5.8744484 C18.6132384,6.14946619 18.2365836,6.25964413 18.0264769,6.0572242 C17.815516,5.82918149 17.8223488,5.49096085 17.8351601,5.20142349 C17.8624911,4.97252669 17.9051957,4.6744484 18.1503203,4.57793594 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M47.6933808,8.8919573 C48.2075445,8.91245552 48.7319573,8.83900356 49.2392883,8.94918149 C49.6313167,9.04227758 49.8474021,9.44626335 49.8294662,9.8288968 C49.8337367,11.7898932 49.8345907,13.7508897 49.8294662,15.711032 C49.8414235,16.0731673 49.6560854,16.4617794 49.2896797,16.5711032 C48.7703915,16.7145907 48.2246263,16.634306 47.6942349,16.6539502 C47.6942349,15.6042705 47.6959431,14.5537367 47.6933808,13.5040569 C48.1067616,13.5032028 48.5209964,13.504911 48.9352313,13.5032028 C48.9360854,13.0445552 48.9352313,12.5867616 48.9360854,12.1281139 C48.5218505,12.1272598 48.1076157,12.128968 47.6942349,12.1272598 C47.6942349,11.0485409 47.6959431,9.97067616 47.6933808,8.8919573 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M65.5439146,8.8919573 C66.0563701,8.91245552 66.5790747,8.83985765 67.0855516,8.9483274 C67.4784342,9.03886121 67.6970819,9.44199288 67.68,9.82548043 C67.6851246,11.7864769 67.6851246,13.7483274 67.68,15.7101779 C67.6919573,16.070605 67.5091815,16.4592171 67.144484,16.569395 C66.6243416,16.7162989 66.0768683,16.634306 65.5447687,16.6539502 C65.5447687,15.6042705 65.5456228,14.5537367 65.5439146,13.5040569 C65.9572954,13.5032028 66.3715302,13.504911 66.7857651,13.5032028 C66.7866192,13.0445552 66.7857651,12.5867616 66.7866192,12.1281139 C66.3723843,12.1272598 65.9581495,12.128968 65.5447687,12.1272598 C65.5447687,11.0485409 65.5456228,9.97067616 65.5439146,8.8919573 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M55.1154448,14.6408541 C55.430605,12.8293238 55.7645552,11.0203559 56.0762989,9.20882562 C56.3880427,11.0203559 56.722847,12.8293238 57.037153,14.6408541 C56.3965836,14.6365836 55.7560142,14.6374377 55.1154448,14.6408541 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M72.8814235,14.6903915 C73.1948754,12.877153 73.5288256,11.0681851 73.8422776,9.25494662 C74.1557295,11.0681851 74.4879715,12.8780071 74.806548,14.6903915 L72.8814235,14.6903915 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M4.82562278,14.4913879 C5.2227758,14.4128114 5.66434164,14.5229893 5.98718861,14.7664057 C6.27330961,14.9560142 6.1486121,15.4641993 5.80697509,15.4966548 C5.44483986,15.5410676 5.06647687,15.4172242 4.75814947,15.2318861 C4.47629893,15.0670463 4.52839858,14.6075445 4.82562278,14.4913879 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M46.5301068,24.203274 C47.0698932,24.230605 47.6318861,24.1281139 48.157153,24.2912456 C48.7814947,24.5158719 48.7575801,25.5305338 48.1682562,25.7893238 C47.6575089,26.0250534 47.0733096,25.8721708 46.5309609,25.9148754 C46.5301068,25.3443416 46.5318149,24.7738078 46.5301068,24.203274 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M52.1209964,24.1955872 C52.6360142,24.0563701 53.2552313,24.2220641 53.5609964,24.6790036 C53.8966548,25.1461922 53.9487544,25.7466192 53.9308185,26.3043416 C53.9461922,26.8680427 53.9086121,27.4744484 53.5797865,27.9544484 C53.1202847,28.6718861 51.9279715,28.680427 51.4368683,27.9945907 C51.1182918,27.5590036 51.0166548,27.0021352 51.037153,26.4725979 C51.0320285,26.0019929 51.0166548,25.5160142 51.2054093,25.0744484 C51.3497509,24.6593594 51.6879715,24.304911 52.1209964,24.1955872 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M64.1696797,24.193879 C64.6821352,24.0580783 65.2953737,24.2229181 65.6002847,24.6755872 C65.9402135,25.1453381 65.9914591,25.7500356 65.9735231,26.3120285 C65.9888968,26.8740214 65.9496085,27.4770107 65.621637,27.9553025 C65.1621352,28.6727402 63.9681139,28.679573 63.4778648,27.9928826 C63.1609964,27.5581495 63.0585053,27.0021352 63.0798577,26.473452 C63.0747331,26.002847 63.0593594,25.5160142 63.2481139,25.0744484 C63.3924555,24.6567972 63.7349466,24.3014947 64.1696797,24.193879 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M96.7165836,24.2246263 C97.2444128,24.0409964 97.9140214,24.1861922 98.2419929,24.6619217 C98.6092527,25.1581495 98.6331673,25.8021352 98.6169395,26.3948754 C98.6357295,26.954306 98.5742349,27.5581495 98.2232028,28.0167972 C97.7192883,28.6992171 96.5252669,28.652242 96.0819929,27.9271174 C95.6609253,27.3010676 95.713879,26.5170107 95.732669,25.799573 C95.77879,25.1641281 96.0606406,24.443274 96.7165836,24.2246263 Z"
                                  ></path>
                                  <path
                                    id="Shape"
                                    d="M46.5301068,26.5093238 C46.993879,26.5135943 47.4585053,26.4965125 47.9222776,26.5170107 C48.2869751,26.5332384 48.6593594,26.787758 48.7191459,27.1635587 C48.8361566,27.6 48.692669,28.1551601 48.2417082,28.3370819 C47.6976512,28.5497509 47.0989324,28.4250534 46.5309609,28.458363 C46.5301068,27.8083986 46.5318149,27.1592883 46.5301068,26.5093238 Z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="design">
            &copy; Coppyright 2023 VISIANA, Developed by WebNhuY.vn
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
