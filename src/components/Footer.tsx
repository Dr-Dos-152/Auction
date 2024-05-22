import React from "react"
import style from "../styles/Footer.module.scss"

const Footer = () => {
  return (
    <div id="footer" className={style.footer}>
      <div className={style.footerText}>
        <p>
          Made by <a target={"_blank"} href="https://github.com/Dr-Dos-152" >Dr_Dos_152</a>
        </p>
      </div>

    </div>
  )
}

export default Footer
