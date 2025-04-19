import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  root: 'public',
  server: {
    open: '/gallery/'
  }
})
