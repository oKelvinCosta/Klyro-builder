import path from 'path';
import { fileURLToPath } from 'url';

import * as express from 'express';

import * as scormService from '../services/scormService.ts';

type Request = express.Request;
type Response = express.Response;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const savePuckData = async (req: Request, res: Response) => {
  try {
    const { puckData, project } = req.body;

    if (!puckData) {
      return res.status(400).json({
        error: 'Dados do Puck nao enviados.',
      });
    }

    // Definição de caminhos
    const tempDir = path.join(__dirname, '../../temp');
    const scormOpenDir = path.join(__dirname, '../../temp/scorm-open');
    const filePath = path.join(scormOpenDir, 'puck-data.json');
    const frontendDir = path.resolve(__dirname, '../../../frontend');
    const buildOutputSource = path.join(frontendDir, 'dist/static-site');

    
    // 1. Limpeza da pasta de destino
    // 2. Salva o arquivo JSON de dados
    scormService.saveJsonFile(puckData, tempDir, scormOpenDir, 'puck-data.json');
    console.info(`Arquivo de dados salvo em: ${filePath}`);


    // runFrontendBuild and copy the files to tempDir
    await scormService.copyFrontendBuildOutput(frontendDir, buildOutputSource, scormOpenDir);
  

    // 5. Gera o manifesto SCORM
    console.info('Gerando manifesto SCORM...');
    const scormMsg = await scormService.generateScormManifest(scormOpenDir, frontendDir);
    console.info('SCORM Packager:', scormMsg);


    // 6. Compacta a pasta tempDir em um arquivo ZIP
    console.info('Compactando pacote SCORM...');
    // tempDir é backend/temp, queremos salvar o zip em backend/temp
    const zipOutputFolder = tempDir;
    const zipPath = await scormService.zipDirectory(scormOpenDir, zipOutputFolder, project?.slug);
    console.info(`Pacote ZIP gerado: ${zipPath}`);

    // 7. Envia o arquivo para download automático
    return res.download(zipPath, path.basename(zipPath), (err) => {
      if (err) {
        console.error('Erro ao enviar o arquivo ZIP:', err);
      }
    });

  } catch (error) {
    console.error('Erro no processo de exportação/build/SCORM:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor durante o processo.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
