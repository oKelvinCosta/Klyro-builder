import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import archiver from 'archiver';
import dotenv from 'dotenv';
import scopackager from 'simple-scorm-packager';

const execPromise = promisify(exec);

/**
 * Limpa o conteúdo de um diretório sem deletar a pasta raiz.
 */
const clearDirectory = (directory: string): void => {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const curPath = path.join(directory, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        fs.rmSync(curPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(curPath);
      }
    });
  } else {
    fs.mkdirSync(directory, { recursive: true });
  }
};

export const saveJsonFile = (data: unknown, parentDir: string, targetDir: string, fileName: string): void => {
    clearDirectory(parentDir);

    // Garante que a pasta de destino exista (caso ela tenha sido removida pelo clearDirectory)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 2. Salva o arquivo JSON de dados
    fs.writeFileSync(path.join(targetDir, fileName), JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Executa o comando de build do frontend.
 */
 const runFrontendBuild = async (frontendDir: string): Promise<void> => {
  await execPromise('npm run build-prod', { cwd: frontendDir });
};

/**
 * Copia arquivos de um diretório para outro recursivamente.
 */
 const copyFiles = (source: string, destination: string): void => {
  if (fs.existsSync(source)) {
    fs.cpSync(source, destination, { recursive: true });
  } else {
    throw new Error(`Diretório de origem não encontrado: ${source}`);
  }
};

export const copyFrontendBuildOutput = async (frontendDir: string, buildOutputSource: string, targetDir: string): Promise<void> => {
    console.info('Iniciando build do frontend...');
    await runFrontendBuild(frontendDir);
    console.info('Build concluído com sucesso.');

    // 4. Copia os arquivos gerados
    console.info(`Copiando arquivos de ${buildOutputSource} para ${targetDir}`);
    copyFiles(buildOutputSource, targetDir);
    console.info('Arquivos copiados com sucesso.'); 
}

/**
 * Gera o manifesto SCORM com base nas configurações do .env do frontend.
 */
export const generateScormManifest = async (targetDir: string, frontendDir: string): Promise<string> => {
  const frontendEnvPath = path.resolve(frontendDir, '.env');
  const frontendEnv = fs.existsSync(frontendEnvPath) 
    ? dotenv.parse(fs.readFileSync(frontendEnvPath)) 
    : {};

  const scormConfig = {
    version: '1.2',
    organization: frontendEnv.VITE_COURSE_ORGANIZATION || 'SESI NEAD MG',
    title: frontendEnv.VITE_COURSE_TITLE || 'Curso POK-BUILDER',
    language: 'pt-BR',
    masteryScore: 80,
    startingPage: 'index.html',
    source: targetDir,
    package: {
      zip: false,
      author: frontendEnv.VITE_COURSE_AUTHOR || 'SESI',
      outputFolder: targetDir,
      description: frontendEnv.VITE_COURSE_DESCRIPTION || '',
      keywords: (frontendEnv.VITE_COURSE_KEYWORDS || 'scorm,curso').split(','),
      typicalDuration: frontendEnv.VITE_COURSE_DURATION || 'PT0H5M0S',
      rights: `©${new Date().getFullYear()} ${frontendEnv.VITE_COURSE_ORGANIZATION || 'SESI'}. Todos os direitos reservados.`,
    },
  };

  return new Promise((resolve) => {
    scopackager(scormConfig, (msg: string) => {
      resolve(msg);
    });
  });
};

/**
 * Compacta um diretório em um arquivo ZIP com timestamp.
 */
const toSafeFilePart = (value?: string): string => {
  if (!value) return 'curso';

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'curso';
};

export const zipDirectory = async (
  sourceDir: string,
  outPath: string,
  packageName?: string
): Promise<string> => {
  const now = new Date();
  
  // Format: DD-MM-YYYY_HH-mm-ss (using dashes for time because colons are invalid in Windows filenames)
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timestamp = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
  const zipName = `SCORM_${toSafeFilePart(packageName)}_${timestamp}.zip`;
  const finalPath = path.join(outPath, zipName);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(finalPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(finalPath));
    archive.on('error', (err: Error) => reject(err));

    archive.pipe(output);
    
    // Compacta todo o conteúdo de sourceDir na raiz do ZIP
    archive.glob('**/*', { 
      cwd: sourceDir,
      dot: true 
    });

    archive.finalize();
  });
};
