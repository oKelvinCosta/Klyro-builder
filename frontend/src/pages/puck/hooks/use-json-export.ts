/**
 * Utility function to export data as JSON file
 */
const saveJsonFile = async (data: unknown) => {
  // console.log('Saving data:', data);

  try {
    // Create blob with JSON data
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'database.json';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    // console.log('Database.json downloaded successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export function useJsonExport() {
  return {
    saveJsonFile,
  };
}
