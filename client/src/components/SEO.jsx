import { Helmet } from "react-helmet-async";

const SITE_NAME = "hiromart";
const DEFAULT_DESC = "Your premier online shopping destination in Rwanda. Shop fashion, electronics, accessories, and more with fast delivery across Kigali.";
const SITE_URL = "https://hiromart-client.netlify.app";
const DEFAULT_IMAGE = "https://res.cloudinary.com/dkmdeqbof/image/upload/v1779451345/Gemini_Generated_Image_ekvkvnekvkvnekvk_znyrps.png";

export default function SEO({ title, description, image, url, keywords, type = "website" }) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Shop Online in Rwanda`;
  const pageDesc = description || DEFAULT_DESC;
  const pageImage = image || DEFAULT_IMAGE;
  const pageUrl = url || SITE_URL;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={pageImage} />
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
}
