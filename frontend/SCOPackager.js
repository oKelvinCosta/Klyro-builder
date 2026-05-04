import dotenv from 'dotenv';
import path from 'path';
import scopackager from 'simple-scorm-packager';
import { fileURLToPath } from 'url';
dotenv.config();

// **🔴ATENÇÃO🔴**
// Configurações dinâmicas baseadas no curso
const courseConfig = {
  title: process.env.VITE_COURSE_TITLE || 'Curso Padrão',
  description: process.env.VITE_COURSE_DESCRIPTION || 'Descrição padrão do curso.',
  keywords: process.env.VITE_COURSE_KEYWORDS
    ? process.env.VITE_COURSE_KEYWORDS.split(',')
    : ['scorm', 'curso'],
  typicalDuration: process.env.VITE_COURSE_DURATION || 'PT0H5M0S',
  author: process.env.VITE_COURSE_AUTHOR || 'Autor',
  organization: process.env.VITE_COURSE_ORGANIZATION || 'Organização',
};

// Obtenha o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import folder name from .env.local
const folder = process.env.VITE_DIST_BUILD;

// Obtenha as configurações do curso atual
const { title, description, keywords, typicalDuration, author, organization } = courseConfig;

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
    typicalDuration: typicalDuration,
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
