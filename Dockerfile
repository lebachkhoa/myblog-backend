# Dùng image chính thức Node.js 20 làm base
FROM node:20

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json trước để cache layer dependencies
COPY package*.json ./

# Cài đặt dependencies (npm install)
RUN npm install

# Copy toàn bộ mã nguồn của bạn vào container
COPY . .

# Khai báo cổng mà ứng dụng lắng nghe (phải trùng với app.listen trong code)
EXPOSE 3000

# Lệnh mặc định khi container chạy: node index.js
CMD ["node", "index.js"]
