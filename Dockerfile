# Usar una imagen de Node.js que incluya todas las dependencias necesarias para ejecutar Puppeteer
FROM node:14-slim

# Instalar Puppeteer
RUN npm install puppeteer

# Agregar el usuario 'puppeteer' para ejecutar el proceso de Node.js
RUN groupadd -r puppeteer && useradd -r -g puppeteer -G audio,video puppeteer \
    && mkdir -p /home/puppeteer/Downloads \
    && chown -R puppeteer:puppeteer /home/puppeteer

# Ejecutar todo como 'puppeteer' a partir de ahora
USER puppeteer

# Copiar el archivo 'package.json' y 'package-lock.json' (si está disponible)
COPY package*.json ./

# Instalar todas las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Iniciar la aplicación
CMD [ "npm", "start" ]
