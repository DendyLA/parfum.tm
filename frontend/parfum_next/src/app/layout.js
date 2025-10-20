import "@/styles/global.scss";
import Header from "@/components/Header/Header"; 



export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        
        <main>{children}</main>
      </body>
    </html>
  );
}
