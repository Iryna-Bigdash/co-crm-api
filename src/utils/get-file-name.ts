export function getFileName(companyTitle: string, documentNumber: string, originalName: string): string {
    const safeTitle = (companyTitle ?? 'company').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeNumber = (documentNumber ?? 'doc').replace(/[^a-zA-Z0-9_-]/g, '_');
  
    const ext = originalName.substring(originalName.lastIndexOf('.'));
    return `${safeTitle}-${safeNumber}${ext}`;
  }
  