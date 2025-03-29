#!/bin/bash

# ไฟล์สำหรับเก็บ cookie
COOKIE_FILE="cookies.txt"

# ขั้นตอนที่ 1: Login และเก็บ cookie (token)
echo "Logging in..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test01@test.com","password":"1234"}' \
  -c $COOKIE_FILE \
  localhost:3000/api/auth/login

# ตรวจสอบว่า login สำเร็จและมี cookie หรือไม่
if [ -f "$COOKIE_FILE" ]; then
  echo -e "\nCookie saved in $COOKIE_FILE:"
  cat $COOKIE_FILE
else
  echo "Login failed or no cookie received!"
  exit 1
fi

# ขั้นตอนที่ 2: Logout โดยใช้ cookie (token) ที่เก็บไว้
echo -e "\nLogging out..."
curl -X POST \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  localhost:3000/api/auth/logout

# ตรวจสอบผลลัพธ์ (เช่น response จาก logout)
echo -e "\nLogout completed."
