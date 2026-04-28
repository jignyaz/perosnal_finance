# Azure Deployment Automation Script (App Service Version)
# This script deploys the backend as an Azure Web App instead of a Container App.

$RESOURCE_GROUP = "PersonalFinance-RG"
$LOCATION = "eastus"
$WEB_APP_NAME = "finance-backend-" + (Get-Random -Maximum 9999)
$STATIC_WEB_APP_NAME = "finance-frontend"

Write-Host "--- Initializing Azure Resources ---" -ForegroundColor Cyan

# 1. Create Resource Group (if it doesn't exist)
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Deploy Backend as an Azure Web App
Write-Host "--- Deploying Backend to Azure App Service ---" -ForegroundColor Cyan
cd backend
# az webapp up packages the folder, creates the app service plan (B1 tier), the web app, and deploys.
az webapp up --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --sku B1 --runtime "PYTHON:3.10"

# 3. Configure the startup command for FastAPI
Write-Host "--- Configuring Startup Command ---" -ForegroundColor Cyan
az webapp config set --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --startup-file "python -m uvicorn main:app --host 0.0.0.0"

# Get the Backend URL
$BACKEND_URL = (az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostName --output tsv)
$BACKEND_FULL_URL = "https://$BACKEND_URL"

Write-Host "Backend deployed at: $BACKEND_FULL_URL" -ForegroundColor Green

# 4. Deploy Frontend
Write-Host "--- Deploying Frontend to Static Web Apps ---" -ForegroundColor Cyan
cd ../frontend
$env:VITE_API_URL = $BACKEND_FULL_URL
npm run build
az staticwebapp create --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --source "./dist" --branch main

Write-Host "--- Deployment Complete ---" -ForegroundColor Yellow
Write-Host "Your Backend is at: $BACKEND_FULL_URL"
Write-Host "Check the Azure Portal for the Frontend Static Web App URL."
