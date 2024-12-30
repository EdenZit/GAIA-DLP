#!/bin/bash

# Step 1: Get CSRF token and save cookie
CSRF_RESPONSE=$(curl -c cookies.txt http://localhost:3000/api/auth/csrf)
CSRF_TOKEN=$(echo $CSRF_RESPONSE | sed 's/.*"csrfToken":"\([^"]*\)".*/\1/')

echo "CSRF Token: $CSRF_TOKEN"

# Step 2: Attempt login with saved cookie
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d "{\"email\":\"testnew@example.com\",\"password\":\"testpass123\",\"csrfToken\":\"$CSRF_TOKEN\",\"json\":true}" \
  -v

# Step 3: Check session with saved cookies
curl -b cookies.txt http://localhost:3000/api/auth/session -v
