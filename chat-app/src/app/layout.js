import { Box } from "@mui/material";
import "./globals.css";
export const metadata = {
  title: "FChat",
  description: "114154 Bussness Analyst",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Box sx={{
          background:'var(--background)'
        }}>
        {children}
        </Box>
      </body>
    </html>
  );
}
