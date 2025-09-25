# Deployment Guide

## Environment Variables Required

For production deployment, you'll need these environment variables:

### Public Variables
```bash
NEXT_PUBLIC_PROJECT_NAME="path-habit-streaks"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="RiGc8v1f4elU9wD5wmfGW0CKwdJjkXIn"
NEXT_PUBLIC_URL="https://your-domain.vercel.app"
```

### Private Variables
```bash
UPSTASH_REDIS_REST_URL="https://mighty-filly-11863.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AS5XAAIncDI5NTQ1MWFkNjM5YTI0MTk5ODNjNzQ3NzA5ZGFmYTQ3OXAyMTE4NjM"
```

## Deployment Steps

1. **Deploy to Vercel**:
   ```bash
   # Connect your repo and deploy
   npm run build  # Test locally first
   ```

2. **Set Environment Variables** in Vercel dashboard:
   - Add all variables above
   - Update `NEXT_PUBLIC_URL` with your deployed URL

3. **Test Production**:
   - Visit your deployed URL
   - Test wallet connection
   - Test check-in functionality
   - Verify streak persistence

4. **Submit to Farcaster**:
   - Update minikit.config.ts with production URL
   - Submit at https://docs.farcaster.org/miniapp/submit

## Post-Deployment

- [ ] Update `NEXT_PUBLIC_URL` in environment variables
- [ ] Test all functionality in production
- [ ] Submit MiniApp to Farcaster directory
- [ ] Share on Farcaster for testing

Your Redis is already configured and should work in production!