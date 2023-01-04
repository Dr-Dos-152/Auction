import { Button, FormField, Input } from "@cloudscape-design/components";
import Form from "@cloudscape-design/components/form";
import { useState } from "react";

const fetchLogin = async (username: string, password: string) => {
  const base64EncodedUsernamePassword = btoa(username + ":" + password);
  const response = await fetch('/api/v1/login', {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64EncodedUsernamePassword}`,
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
