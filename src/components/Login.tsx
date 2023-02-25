import { Button, FormField, Input, SpaceBetween } from "@cloudscape-design/components";
import Form from "@cloudscape-design/components/form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedContext, FlashbarContext } from "../App";
import fetchWrapper from "../utils/fetchWrapper";


const fetchLogin = async (username: string, password: string) => {
  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);

  const response = await fetchWrapper('/auth/login', {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw Error("Could not login")
  }
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { userIsLoggedIn, setUserIsLoggedIn } = useContext(AuthenticatedContext);

  const handleClickSubmit = async () => {
    try {
      await fetchLogin(username, password);
      navigate('/');
      setUserIsLoggedIn(true)
    } catch (e) {
      console.error(e);
    }
  }

  if (userIsLoggedIn) {
    return <>
      Already logged in
    </>
  }

  return (

    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%"
    }}>

      <Form header={<h1>Login</h1>}>
        <SpaceBetween size={"s"} direction="vertical">
          <FormField label={"Username"}>
            <Input value={username} onChange={(e) => setUsername(e.detail.value)} />
          </FormField>

          <FormField label={"Password"}>
            <Input value={password} type="password" onChange={(e) => setPassword(e.detail.value)} />
          </FormField>

          <Button onClick={handleClickSubmit}>Submit</Button>
        </SpaceBetween>
      </Form>
    </div>
  )
}

export default Login;
