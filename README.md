# BOPP Nong Khai V4 — Prebuilt Cache

V4 แก้ปัญหา BOPP 403 จาก Vercel โดย **หน้าเว็บ Vercel ไม่เรียก BOPP**
ทุกครั้งอีกต่อไป

## โครงสร้าง
BOPP -> Playwright browser runner (GitHub Actions หรือเครื่องที่รัน script ได้)
-> `data/cache.json` -> Vercel -> Browser

## สำคัญ
ครั้งแรกต้องรัน refresh script เพื่อสร้าง cache ที่มีพิกัด 287 โรงเรียน
เพราะ Vercel ถูก BOPP/Cloudflare บล็อก จึงไม่สามารถให้ Vercel เป็นตัวดึง
พิกัดครั้งแรกได้

GitHub Actions workflow ให้กด Run workflow ได้เอง และตั้งให้ refresh รายสัปดาห์

## ตรวจสอบ
- `/api/cache-status` ต้องแสดง total=287 และ withCoordinates ใกล้ 287
- `/api/schools` ดึงจาก cache เท่านั้น
