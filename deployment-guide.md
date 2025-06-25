
# Deployment Guide: How to Host Your Website on Vercel

This guide will walk you through deploying your website created with the Business OS Website Builder to Vercel, a popular free hosting platform.

## Prerequisites

- A website downloaded from the Business OS Website Builder
- An email address for creating a Vercel account
- Basic familiarity with file management on your computer

## Step 1: Prepare Your Website Files

1. **Download your website** from the Business OS Website Builder
   - Go to the Website Builder module
   - Find your website in the list
   - Click the "Download" button
   - Your browser will download the HTML file

2. **Create a complete website folder** (for the full version)
   - Create a new folder on your computer (e.g., "my-business-website")
   - Place your downloaded HTML file in this folder
   - Create additional files as needed:
     - `styles.css` - for your website styling
     - `script.js` - for interactive features
     - Add any images to an `images` folder

## Step 2: Create a Vercel Account

1. **Visit Vercel's website**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Sign Up" in the top right corner

2. **Choose sign-up method**
   - You can sign up with GitHub, GitLab, Bitbucket, or email
   - For beginners, email signup is the simplest option

3. **Complete registration**
   - Follow the prompts to verify your email
   - Choose a username for your Vercel account

## Step 3: Deploy Your Website

### Method 1: Drag and Drop (Easiest)

1. **Access the deployment interface**
   - Once logged in, you'll see your Vercel dashboard
   - Look for the "Import Project" or "New Project" button

2. **Upload your files**
   - If you have individual files, you can drag them directly to the deployment area
   - Vercel will automatically detect it as a static website

3. **Configure deployment**
   - Give your project a name (e.g., "my-business-site")
   - Choose deployment settings (defaults are usually fine)
   - Click "Deploy"

### Method 2: Using Git (Recommended for ongoing updates)

1. **Create a GitHub repository** (optional but recommended)
   - Go to [https://github.com](https://github.com) and create an account if needed
   - Create a new repository for your website
   - Upload your website files to the repository

2. **Connect to Vercel**
   - In Vercel, click "Import Git Repository"
   - Connect your GitHub account
   - Select your website repository
   - Click "Import"

## Step 4: Configure Your Domain

### Using Vercel's Free Domain

1. **Automatic domain assignment**
   - Vercel automatically assigns a free domain like `your-site-name.vercel.app`
   - This domain is ready to use immediately

2. **Customize your Vercel domain**
   - In your project settings, you can change the subdomain name
   - Go to Project Settings → Domains
   - Edit the Vercel domain to your preference

### Using Your Own Custom Domain (Optional)

1. **Purchase a domain** (if you don't have one)
   - Use services like Namecheap, GoDaddy, or Google Domains
   - Choose a domain that represents your business

2. **Add custom domain to Vercel**
   - In your Vercel project, go to Settings → Domains
   - Click "Add Domain"
   - Enter your custom domain name
   - Follow the DNS configuration instructions provided

3. **Configure DNS settings**
   - Log into your domain registrar's control panel
   - Update the DNS records as instructed by Vercel
   - This usually involves adding A records or CNAME records

## Step 5: Test Your Website

1. **Visit your deployed site**
   - Click on the provided Vercel URL
   - Test all pages and functionality
   - Check that the site loads properly on mobile devices

2. **Verify functionality**
   - Test all navigation links
   - Ensure images load correctly
   - Check that contact forms work (if applicable)

## Step 6: Managing Updates

### For Drag-and-Drop Deployments

1. **Make changes locally**
   - Edit your website files on your computer
   - Test changes by opening the HTML file in your browser

2. **Redeploy to Vercel**
   - Go to your Vercel project dashboard
   - Upload the updated files
   - Vercel will automatically deploy the new version

### For Git-Connected Projects

1. **Update your repository**
   - Make changes to your files
   - Commit and push changes to your GitHub repository

2. **Automatic deployment**
   - Vercel automatically detects changes in your repository
   - Your website updates within minutes

## Troubleshooting Common Issues

### Website Not Loading
- Check that your main file is named `index.html`
- Verify all file paths are correct (case-sensitive)
- Ensure images and CSS files are in the correct folders

### Custom Domain Not Working
- Allow 24-48 hours for DNS propagation
- Double-check DNS record configuration
- Contact your domain registrar if issues persist

### Images Not Displaying
- Verify image file paths are correct
- Ensure image files were uploaded to Vercel
- Check that image file names match exactly (case-sensitive)

## Best Practices

1. **Regular Backups**
   - Keep local copies of your website files
   - Consider using Git for version control

2. **Performance Optimization**
   - Compress images before uploading
   - Minimize CSS and JavaScript files
   - Use Vercel's built-in analytics to monitor performance

3. **Security**
   - Keep your Vercel account secure with a strong password
   - Enable two-factor authentication
   - Regularly update your website content

## Getting Help

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [https://github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Business OS Support**: Contact our support team for website builder specific questions

## Cost Information

- **Vercel Free Tier**: Includes hosting for personal and small commercial projects
- **Custom Domains**: Free to add, but you need to purchase the domain separately
- **Bandwidth**: Generous free tier limits for most small business websites
- **Upgrade Options**: Available if you need more resources or features

Congratulations! Your website is now live and accessible to the world. You can share your URL with customers, add it to business cards, and start building your online presence.
