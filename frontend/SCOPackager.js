import dotenv from 'dotenv';
import path from 'path';
import scopackager from 'simple-scorm-packager';
import { fileURLToPath } from 'url';
import { courseConfig } from './src/config/course-config.ts';
dotenv.config();

// **🔴ATENÇÃO🔴**
// Configurações dinâmicas baseadas no curso (agora centralizadas)
const { title, description, keywords, duration, author, organization, distBuildFolder } =
  courseConfig;

// Obtenha o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import folder name from configuração centralizada
const folder = distBuildFolder;

// Configuração do SCORM
const config = {
  version: '1.2',
  organization: organization,
  title: title,
  language: 'pt-BR',
  masteryScore: 80,
  startingPage: 'index.html',
  source: path.join(__dirname, `dist/${folder}`), // Pasta para os arquivos SCORM
  package: {
    zip: false,
    author: author,
    outputFolder: path.join(__dirname, `dist/${folder}`), // Pasta para salvar o ZIP
    description: description,
    keywords: keywords,
    typicalDuration: duration,
    rights: `©${new Date().getFullYear()} ${organization}. Todos os direitos reservados.`,
    vcard: {
      author: author,
      org: organization,
    },
  },
};

// Executa o pacote SCORM
scopackager(config, function (msg) {
  console.info(msg);
  process.exit(0);
});
