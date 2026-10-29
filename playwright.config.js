import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:120000,use:{baseURL:process.env.SITE_URL||'http://127.0.0.1:5173',channel:'msedge',headless:true},workers:1,reporter:'list'});
