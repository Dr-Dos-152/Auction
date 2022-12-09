import React from "react"
import style from "../styles/Footer.module.scss"

const Footer = () => {
  return (
    <div id="footer" className={style.footer}>
      <div className={style.footerText}>
        Copyright © Yet Another Auction App
      </div>
    </div>
  )
}

export default Footer
