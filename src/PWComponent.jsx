import { useState } from "react"
import bcrypt from "bcryptjs-react";



export default function PWComponent({children}) {
  const [show, setShow] = useState(false)
  const [msg, setMsg] = useState('')

  function checkPW(e) {
    e.preventDefault()
    const pw = e.target[0].value
    // later

    if (bcrypt.compareSync(pw, '$2b$10$p3pbRDdfxh6oA..E7NtF.eyNSZs5Eaw6s3kWJgbzdgLrZpVfvolF6')) {
      setShow(true)
    } else {
      setMsg("Das Passwort ist leider falsch...")
    }
  }
  return (
    <>
      {show && children}
      {show || <form style={{
        height: '200px',
        width: '80%',
        backgroundColor: 'rgba(255, 30, 30, 0.8)',
        margin: '0 auto',
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}
       onSubmit={(e) => checkPW(e)}>
        <span>{msg}</span>
        <label htmlFor="pw">
        Passwort:
        <input type="password" />
        </label>
        <input style={{
          height: '40px',
          width: '150px'
        }} type="submit" />
      </form>}
    </>
  )
}