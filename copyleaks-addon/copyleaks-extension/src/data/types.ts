export interface IScanResult {
    scannedDocument: ScannedDocument;
    results: Results;
    notifications: Notifications;
    status: number;
    developerPayload: string;
  }
  
  interface Notifications {
    alerts: any[];
  }
  
  interface Results {
    score: Score;
    internet: Internet[];
    database: any[];
    batch: any[];
    repositories: any[];
  }
  
  interface Internet {
    url: string;
    id: string;
    title: string;
    introduction: string;
    matchedWords: number;
    identicalWords: number;
    similarWords: number;
    paraphrasedWords: number;
    totalWords: number;
    metadata: Metadata2;
    tags: any[];
  }
  
  interface Metadata2 {
    publishDate?: string;
    lastModificationDate?: string;
    author?: string;
    filename?: string;
  }
  
  interface Score {
    identicalWords: number;
    minorChangedWords: number;
    relatedMeaningWords: number;
    aggregatedScore: number;
  }
  
  interface ScannedDocument {
    scanId: string;
    totalWords: number;
    totalExcluded: number;
    credits: number;
    expectedCredits: number;
    creationTime: string;
    metadata: Metadata;
    enabled: Enabled;
    detectedLanguage: string;
  }
  
  interface Enabled {
    plagiarismDetection: boolean;
    aiDetection: boolean;
    explainableAi: boolean;
    writingFeedback: boolean;
    pdfReport: boolean;
    cheatDetection: boolean;
  }
  
  interface Metadata {
    filename: string;
  }

  export interface ComponentData{
    title: string, 
    content: string
  }