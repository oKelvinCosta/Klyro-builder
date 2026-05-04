// Type definitions for pipwerks-scorm-api-wrapper
// Project: https://github.com/pipwerks/scorm-api-wrapper
// Docs: https://pipwerks.com/using-a-scorm-wrapper-to-simplify-the-workflow/

declare module 'pipwerks-scorm-api-wrapper' {
  export interface SCORMAPI {
    version: string;
    handleCompletionStatus: boolean;
    isAvailable: boolean;
    API: {
      find: (win: Window) => object;
      get: () => object;
      getHandle: () => object;
    };
    connection: {
      isActive: boolean;
      initialize: () => boolean;
      terminate: () => boolean;
    };
    data: {
      completionStatus?: string;
      get: (parameter: string) => string;
      set: (parameter: string, value: string) => boolean;
      save: () => boolean;
    };
    debug: {
      getCode: () => number;
      getInfo: (errorCode: number) => string;
      getDiagnosticInfo: (errorCode: number) => string;
    };
    UTILS: {
      StringToBoolean: (str: string) => boolean;
      trace: (msg: string) => void;
    };

    // Shortcuts from data
    init: () => boolean;
    get: (parameter: string) => string;
    set: (parameter: string, value: string) => boolean;
    save: () => boolean;
    quit: () => boolean;
  }

  export const SCORM: SCORMAPI;

  // Debug global do pipwerks (not confunds with SCORM.debug)
  interface PipwerksDebug {
    isActive: boolean;
    log: (...args: unknown[]) => void;
  }

  const pipwerks: {
    SCORM: SCORMAPI;
    debug: PipwerksDebug;
  };

  export default pipwerks;
}
