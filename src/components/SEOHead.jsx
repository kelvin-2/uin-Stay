import { Helmet } from 'react-helmet-async'

const SEOHead = ({ 
  title = "UniStay – Find Student Accommodation", 
  description = "Find affordable student accommodation near universities. Browse verified listings and secure your perfect student housing.",
  keywords = "student accommodation in Port Elizabirth, student housing, university housing",
  image = "/og-image.jpg",
  url = "https://uinstay.co.za"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <link rel="canonical" href={url} />
    </Helmet>
  )
}

export default SEOHead