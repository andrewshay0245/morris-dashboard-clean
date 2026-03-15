import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Try to read from the scraper directory
    const progressPath = path.join('/Users/hugomcevoy/clawd/college-coach-scraper/progress_data.json');
    
    if (fs.existsSync(progressPath)) {
      const data = fs.readFileSync(progressPath, 'utf8');
      const progressData = JSON.parse(data);
      res.status(200).json(progressData);
    } else {
      // Fallback default data
      res.status(200).json({
        totalSchools: 46,
        totalCoaches: 3884,
        completionRate: 4.0,
        currentRate: 0.0,
        eta: "Starting scraping engine...",
        divisions: {
          D1: { completed: 46, total: 366, coaches: 3884 },
          D2: { completed: 0, total: 305, coaches: 0 },
          D3: { completed: 0, total: 429, coaches: 0 },
          NAIA: { completed: 0, total: 32, coaches: 0 }
        },
        timeline: [],
        lastUpdated: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error reading progress data:', error);
    res.status(500).json({ error: 'Failed to load progress data' });
  }
}