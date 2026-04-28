# Azure Deployment Automation Script
# This script automates the deployment of the Personal Finance Dashboard.

$RESOURCE_GROUP = "PersonalFinance-RG"
$LOCATION = "eastus"
$ACR_NAME = "financeacr" + (Get-Random -Maximum 9999)
$CONTAINER_APP_NAME = "finance-backend"
$STATIC_WEB_APP_NAME = "finance-frontend"

Write-Host "--- Initializing Azure Resources ---" -ForegroundColor Cyan

# 1. Create Resource Group
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create Azure Container Registry
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# 3. Build and Push Backend Image
$ACR_LOGIN_SERVER = (az acr show --name $ACR_NAME --query loginServer --output tsv)
az acr build --registry $ACR_NAME --image finance-backend:v1 ./backend

# 4. Deploy Backend to Container Apps
az containerapp env create --name finance-env --resource-group $RESOURCE_GROUP --location $LOCATION
$ACR_PASSWORD = (az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)
az containerapp create --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --environment finance-env `
    --image "$ACR_LOGIN_SERVER/finance-backend:v1" --target-port 8000 --ingress external `
    --registry-server $ACR_LOGIN_SERVER --registry-username $ACR_NAME --registry-password $ACR_PASSWORD `
    --query "properties.configuration.ingress.fqdn"

$BACKEND_URL = (az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)
$BACKEND_FULL_URL = "https://$BACKEND_URL"

Write-Host "Backend deployed at: $BACKEND_FULL_URL" -ForegroundColor Green

# 5. Build and Deploy Frontend
Write-Host "--- Deploying Frontend ---" -ForegroundColor Cyan
cd frontend
# Note: You may need to run 'npm run build' first with VITE_API_URL set
$env:VITE_API_URL = $BACKEND_FULL_URL
npm run build
az staticwebapp create --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --source "./dist" --branch main

Write-Host "--- Deployment Complete ---" -ForegroundColor Yellow
Write-Host "Your application will be live shortly at the Static Web App URL."
