import { Avatar, Box } from "@mui/material";
import TextMarkDownRender from "../TextMarkdownRender";

export default function MessageCard({ role, message }) {
  const srcUser =
    "https://atg-prod-scalar.s3.amazonaws.com/studentpower/media/user%20avatar.png";
  const srcAssistant = "https://avatars.githubusercontent.com/u/140789367?…00&u=5230be17c778ac787086f6c414c7408ea91c0e7e&v=4"
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyItems: "start",
        padding: 1,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 2,
        width: "78vw",
        maxWidth: "620px",
        marginBottom: 3,
      }}
    >
      <Avatar
        className="avatar"
        alt="User Avatar"
        src={role == "user"? srcUser:srcAssistant}
        sx={{ width: 46, height: 46, marginRight: 2 }}
      />
      <Box
        sx={{
          flex: 1,
          width: "100%",
          padding: 2,
          paddingTop: 0,
          boxSizing: "border-box",
          fontSize: 16,
        }}
      >
        <TextMarkDownRender text={message} />
      </Box>
    </Box>
  );
}
