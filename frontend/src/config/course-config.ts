/**
 * Configurações centralizadas do curso SCORM
 *
 * Este arquivo substitui as variáveis de ambiente que eram usadas para configurações
 * do curso, mantendo apenas variáveis de ambiente reais (credenciais, URLs, etc.)
 */

interface CourseConfigInterface {
  // Metadados do curso
  title: string;
  description: string;
  keywords: string[];
  duration: string; // ISO 8601 format (e.g., "PT0H30M0S")
  author: string;
  organization: string;

  // Configurações de build
  distBuildFolder: string;

  // Flags de ambiente (ainda usam variáveis de ambiente)
  // Estas são definidas nos arquivos .env específicos por ambiente
  // e são acessadas via import.meta.env
}

// Carrega configuração do arquivo JSON
// import courseConfig from './course-config.json';
export const courseConfig: CourseConfigInterface = {
  title: 'Quero fazer um empréstimo!',
  description: 'Quero fazer um empréstimo!',
  keywords: ['scorm 1.2', 'curso', 'robótica'],
  duration: 'PT0H30M0S',
  author: 'NEAD SESI MG',
  organization: 'SESI NEAD MG',
  distBuildFolder: 'static-site',
};
/**
 * SCORM Confings
 */
interface ScormConfigProps {
  env: 'DEV' | 'PROD'; // DEV Does'nt connect to SCORM server, so SCORM functions will not work. PROD will work in a LMS environment
  appScorm: boolean; //se o curso será executado em um ambiente SCORM
  debug: boolean; // se será executado em modo de depuração ou não
}

// Default value
const scormConfigDefault: ScormConfigProps = {
  env: 'PROD',
  appScorm: true,
  debug: false,
};

// Var to replace values
var scormConfigReplace: ScormConfigProps = {
  env: scormConfigDefault.env,
  appScorm: scormConfigDefault.appScorm,
  debug: scormConfigDefault.debug,
};

// Get SCORM current Config
export const getScormConfig = () => ({
  env: scormConfigReplace.env,
  appScorm: scormConfigReplace.appScorm,
  debug: scormConfigReplace.debug,
});

// Set SCORM Config
export const setScormConfig = ({ env, appScorm, debug }: ScormConfigProps) => {
  try {
    scormConfigReplace.env = env;
    scormConfigReplace.appScorm = appScorm;
    scormConfigReplace.debug = debug;
    return true;
  } catch (error) {
    console.error('Error setting SCORM config:', error);
    return false;
  }
};

// Set global SCORM Config (PROD)
// setScormConfig({ appScorm: true, debug: false, env: 'PROD' });

// Set global SCORM Config (DEV)
setScormConfig({ appScorm: true, debug: true, env: 'DEV' });
