# Use imagem oficial do Node (peso leve)
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json e instala dependências
COPY package*.json ./
RUN npm ci --only=production

# Copia todo o código
COPY backend ./backend
COPY frontend ./frontend

# Cria a pasta de dados (onde os .txt ficarão)
RUN mkdir -p backend/data

# Exponha a porta que seu app usa (3000 por padrão)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
 
