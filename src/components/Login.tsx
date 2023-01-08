import { Button, FormField, Input } from "@cloudscape-design/components";
import Form from "@cloudscape-design/components/form";
import { useState } from "react";
import getCookie from "../utils/cookieUtils";


const fetchCSRFCookie = async () => {
  await fetch("/auth/login")
}

const fetchLogin = async (username: string, password: string) => {
  await fetchCSRFCookie()
  const csrfToken = getCookie('XSRF-TOKEN') as string
  console.log('csrfToken', csrfToken);

  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);
  // const base64EncodedUsernamePassword = btoa(username + ":" + password);
  const response = await fetch('/auth/login', {
    method: "POST",
    body: formData,
    headers: {
      "X-XSRF-TOKEN": csrfToken
    }
  })
  if (!response.ok) {
    throw Error("Could not login")
  }
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const handleClickSubmit = async () => {
    console.log(username, password);
    await fetchLogin(username, password);
  }

  return (
    <Form>

      <FormField label={"Username"}>
        <Input value={username} onChange={(e) => setUsername(e.detail.value)} />
      </FormField>

      <FormField label={"Password"}>
        <Input value={password} onChange={(e) => setPassword(e.detail.value)} />
      </FormField>

      <Button onClick={handleClickSubmit}>Submit</Button>
    </Form>
  )
}

export default Login;
