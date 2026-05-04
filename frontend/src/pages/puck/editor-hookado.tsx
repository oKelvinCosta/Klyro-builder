// // Imports
// import '@//styles/editor.css';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { config } from '@/editor/puck.config';
// import { useEditorMode } from '@/editor/stores/editor-mode-store';
// import { Puck } from '@puckeditor/core';
// import '@puckeditor/core/puck.css';
// import { Eye, Rocket } from 'lucide-react';
// import { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Custom hooks
// import { exportToJsonFile, useCurrentPuckData } from './hooks/use-json-export';
// import { usePageLoader } from './hooks/use-page-loader';
// import { usePageUpdater } from './hooks/use-page-updater';

// // Static data (can be removed if unused)
// // const initialData = database;
// // const database2Data = database2;

// /**
//  * Main Puck Editor Component
//  * Handles page loading, editing, and auto-save functionality
//  */
// export function Editor() {
//   // Navigation and editor mode
//   const navigate = useNavigate();
//   const { setMode } = useEditorMode();

//   // Custom hooks for page operations
//   const { pageData, isLoading, isError } = usePageLoader();
//   const { handleChange, cleanup } = usePageUpdater();

//   // Ref to store initial Puck data (populated only once)
//   const initialPuckData = useRef<object | null>(null);

//   // Set editor mode to editing on mount
//   useEffect(() => {
//     setMode('editing');
//   }, [setMode]);

//   // Cleanup auto-save timer on unmount
//   useEffect(() => {
//     return cleanup;
//   }, [cleanup]);

//   // Handle preview navigation
//   const handlePreview = () => {
//     navigate('/preview');
//   };

//   // Configuration for Puck editor
//   const configParams = {
//     projectType: 'choices',
//   };

//   // Populate initial data ref only once when page data arrives
//   if (pageData && !initialPuckData.current) {
//     initialPuckData.current = pageData?.puckData?.page ?? {
//       root: { props: {} },
//       content: [],
//       zones: {},
//     };
//   }

//   // Loading state
//   if (isLoading) {
//     return (
//       <div>
//         <Skeleton style={{ height: '100vh' }} className="flex w-full items-center justify-center">
//           <div>Loading editor...</div>
//         </Skeleton>
//       </div>
//     );
//   }

//   // Error state
//   if (isError || !pageData) {
//     return <div>Error loading page.</div>;
//   }

//   return (
//     <Puck
//       key={isLoading ? 'loading' : pageData?.id}
//       config={config(configParams)}
//       data={initialPuckData.current || {}}
//       onChange={handleChange}
//       overrides={{
//         // Header actions with preview and export functionality
//         headerActions: function HeaderActions() {
//           // Get current Puck data for export
//           const currentAppState = useCurrentPuckData();

//           const handlePublish = async () => {
//             await exportToJsonFile(currentAppState);
//           };

//           return (
//             <>
//               <Button variant="outline" title="Preview" size={'icon'} onClick={handlePreview}>
//                 <Eye />
//               </Button>

//               <Button className="flex items-center pt-[7px]" onClick={handlePublish}>
//                 <Rocket /> Export
//               </Button>
//             </>
//           );
//         },

//         // Custom iframe wrapper with puck-canvas class
//         iframe: ({ children }) => {
//           return <div className="puck-canvas">{children}</div>;
//         },
//       }}
//     />
//   );
// }
