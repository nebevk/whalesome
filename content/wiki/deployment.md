# Deployment & Infrastructure

## Netlify

Whalesome is deployed on Netlify, providing a robust and scalable hosting solution.

### Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Features Used

- **Continuous Deployment**

  - Automatic builds on Git push
  - Preview deployments for PRs
  - Branch deployments

- **Custom Domain**

  - SSL/TLS encryption
  - Custom domain setup
  - DNS management

- **Environment Variables**
  - Secure variable storage
  - Environment-specific configs
  - Build-time variables

### Benefits

- Fast global CDN
- Automatic HTTPS
- Easy rollbacks
- Great developer experience
- Built-in analytics
- Form handling
- Serverless functions
