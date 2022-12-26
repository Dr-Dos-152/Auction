import React, { useEffect, useState } from "react"
import useProfile from "../hooks/useProfile"
import {
  Button,
  Container,
  Form,
  FormField,
  Grid,
  Input,
  SpaceBetween,
  Spinner,
} from "@cloudscape-design/components"
import style from "../styles/Profile.module.scss"
import Avatar from "react-avatar-edit"

/**
 * User Profile
 * 1. They can edit name, description
 * 2. They can change their profile picture
 */
const Profile = () => {
  const { data: profile, isLoading, isError, isSuccess } = useProfile()
  const [profileInfo, setProfileInfo] = useState<Profile | null>(null)
  const [imageSource, setImageSource] = useState<null | string>(null)

  console.log(profileInfo)

  useEffect(() => {
    console.log("useEffect")
    if (isSuccess) {
      setProfileInfo(profile)
    }
  }, [isSuccess])

  const handleInputChange = (filterId: string, value: any) => {
    setProfileInfo((prevProfileInfo) => {
      return {
        ...prevProfileInfo,
        [filterId]: value,
      } as Profile
    })
  }

  if (isLoading || profileInfo == null) {
    return <Spinner />
  }

  if (isError) {
    return <p>Error loading profile</p>
  }

  return (
    <Container>
      <Grid
        gridDefinition={[
          { colspan: { m: 4, default: 12 } },
          { colspan: { m: 8, default: 12 } },
        ]}
      >
        <Container header={<h4>Profile Picture</h4>}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar
              width={250}
              height={250}
              exportAsSquare
              onCrop={(preview) => {
                setImageSource(preview)
              }}
              onClose={() => {
                setImageSource(null)
              }}
            />

            {imageSource && (
              <div style={{ margin: "1rem" }}>
                <img height={"250px"} src={imageSource} alt={"Preview"} />
              </div>
            )}
          </div>
        </Container>

        <Form header={<h2>My Profile</h2>}>
          <SpaceBetween size={"m"} direction="vertical">
            <div className={style.nameContainer}>
              <FormField label="First Name">
                <Input
                  value={profileInfo!.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.detail.value)
                  }
                />
              </FormField>
              <FormField label="Last Name">
                <Input
                  value={profileInfo!.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.detail.value)
                  }
                />
              </FormField>
            </div>
            <FormField label="Description">
              <Input
                placeholder="I am..."
                value={profileInfo!.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.detail.value)
                }
              />
            </FormField>

            <Button>Save</Button>
          </SpaceBetween>
        </Form>
      </Grid>
    </Container>
  )
}

export default Profile
