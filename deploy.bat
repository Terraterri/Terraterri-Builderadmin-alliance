@echo off
echo Starting manual deployment for builder-admin-terraterri-com...
REM Set variables
set PROJECT_ID=terraterri-454406
set REGION=asia-south1
set IMAGE_NAME=asia-south1-docker.pkg.dev/%PROJECT_ID%/builder-admin-terraterri-com/builder-admin-terraterri-com:latest
set SERVICE_NAME=builder-admin-terraterri-com
set APP_URL=https://builder-admin-terraterri-com-773090763620.asia-south1.run.app
set SERVICE_ACCOUNT=deployer-sa@terraterri-454406.iam.gserviceaccount.com

REM Build Docker image
echo Building Docker image...
docker build -t %IMAGE_NAME% .

REM Push to Artifact Registry
echo Pushing to Artifact Registry...
docker push %IMAGE_NAME%

REM Deploy to Cloud Run
echo Deploying to Cloud Run...
gcloud run deploy %SERVICE_NAME% ^
  --image=%IMAGE_NAME% ^
  --region=%REGION% ^
  --platform=managed ^
  --allow-unauthenticated ^
  --min-instances=1 ^
  --max-instances=100 ^
  --service-account=%SERVICE_ACCOUNT% ^
  --project=%PROJECT_ID%

echo Deployment completed! Test at %APP_URL% (Note: The actual URL may differ slightly—check the gcloud output for the exact service URL.)
pause REM remember this