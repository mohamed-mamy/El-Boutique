$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:5000/api"

Write-Host "============================================="
Write-Host "1. Login (POST /api/auth/login)"
Write-Host "============================================="
$loginBody = @{
    email = "admin@elboutique.com"
    password = "Admin@123"
} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.token
Write-Host "Login successful. Token obtained."

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n============================================="
Write-Host "2. Categories API (POST and GET)"
Write-Host "============================================="
$catBody = @{
    nameAr = "Category AR"
    nameFr = "Category FR"
} | ConvertTo-Json
$catCreate = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -Body $catBody -Headers $headers
$catId = $catCreate.data._id
Write-Host "Category created: $catId"

$catList = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get
Write-Host "Categories Count: $($catList.data.Count)"

Write-Host "`n============================================="
Write-Host "3. Brands API (POST and GET)"
Write-Host "============================================="
$brandBody = @{
    nameAr = "Brand AR"
    nameFr = "Brand FR"
} | ConvertTo-Json
$brandCreate = Invoke-RestMethod -Uri "$baseUrl/brands" -Method Post -Body $brandBody -Headers $headers
$brandId = $brandCreate.data._id
Write-Host "Brand created: $brandId"

$brandList = Invoke-RestMethod -Uri "$baseUrl/brands" -Method Get
Write-Host "Brands Count: $($brandList.data.Count)"

Write-Host "`n============================================="
Write-Host "4. Products API (POST and GET)"
Write-Host "============================================="
$prodBody = @{
    nameAr = "Product AR"
    nameFr = "Product FR"
    price = 1000
    quantity = 10
    category = $catId
    brand = $brandId
} | ConvertTo-Json
$prodCreate = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $prodBody -Headers $headers
$prodId = $prodCreate.data._id
Write-Host "Product created: $prodId"

$prodList = Invoke-RestMethod -Uri "$baseUrl/products?limit=10" -Method Get
Write-Host "Products Count: $($prodList.data.products.Count)"

Write-Host "`n============================================="
Write-Host "5. Settings API (PUT and GET)"
Write-Host "============================================="
$settingsBody = @{
    storeName = "Super Boutique"
} | ConvertTo-Json
$settingsPut = Invoke-RestMethod -Uri "$baseUrl/settings" -Method Put -Body $settingsBody -Headers $headers
Write-Host "Settings Updated: Store Name is $($settingsPut.data.storeName)"

$settingsGet = Invoke-RestMethod -Uri "$baseUrl/settings" -Method Get
Write-Host "Current Store Name: $($settingsGet.data.storeName)"

Write-Host "`n============================================="
Write-Host "6. Orders API (POST and GET)"
Write-Host "============================================="
$orderBody = @{
    customerName = "Test Customer"
    customerPhone = "+2135555555"
    items = @(
        @{
            product = $prodId
            quantity = 1
        }
    )
} | ConvertTo-Json -Depth 10
$orderCreate = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderBody -ContentType "application/json"
$orderId = $orderCreate.data._id
Write-Host "Order created: $orderId"

$orderList = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Get -Headers $headers
Write-Host "Orders Count: $($orderList.data.orders.Count)"

Write-Host "`n============================================="
Write-Host "7. Dashboard Stats API (GET)"
Write-Host "============================================="
$statsGet = Invoke-RestMethod -Uri "$baseUrl/dashboard/stats" -Method Get -Headers $headers
Write-Host "Dashboard Stats:"
$statsGet.data | ConvertTo-Json -Depth 5 | Write-Host

Write-Host "`nAll tests completed successfully!"
