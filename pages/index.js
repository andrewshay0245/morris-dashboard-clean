import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [data, setData] = useState({
    totalSchools: 294,
    totalCoaches: 7218,
    completionRate: 20.3,
    currentRate: 14.8,
    eta: "NAIA Complete! D1 Phase by March 17, Canada database loaded (107 institutions)",
    divisions: {
      D1: { completed: 52, total: 366, coaches: 4474 },
      D2: { completed: 0, total: 305, coaches: 0 },
      D3: { completed: 0, total: 429, coaches: 0 },
      NAIA: { completed: 242, total: 242, coaches: 2744 },
      U_SPORTS: { completed: 0, total: 58, coaches: 0 },
      CCAA: { completed: 0, total: 49, coaches: 0 }
    },
    timeline: [],
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch('/api/progress');
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
    const interval = setInterval(loadProgress, 30000);
    return () => clearInterval(interval);
  }, []);

  const divisions = ['D1', 'D2', 'D3', 'NAIA', 'U_SPORTS', 'CCAA'];

  return (
    <>
      <Head>
        <title>Morris Coach Extraction Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: 0,
        padding: '20px',
        background: '#f5f5f5',
        color: '#333',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            color: '#0d9488',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            🏆 Morris Coach Extraction Dashboard
          </h1>
          
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '5px' }}>
                {data.totalSchools.toLocaleString()}
              </div>
              <div style={{ fontSize: '1.1em', opacity: 0.9 }}>Schools Scraped</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '5px' }}>
                {data.totalCoaches.toLocaleString()}
              </div>
              <div style={{ fontSize: '1.1em', opacity: 0.9 }}>Coaches Found</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '5px' }}>
                {data.completionRate.toFixed(1)}%
              </div>
              <div style={{ fontSize: '1.1em', opacity: 0.9 }}>Overall Progress</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '5px' }}>
                {data.currentRate.toFixed(1)}
              </div>
              <div style={{ fontSize: '1.1em', opacity: 0.9 }}>Schools/Hour</div>
            </div>
          </div>

          {/* ETA */}
          <div style={{
            background: '#fef3c7',
            color: '#92400e',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            margin: '20px 0',
            fontWeight: 'bold'
          }}>
            Estimated completion: {data.eta}
          </div>

          {/* Division Progress */}
          <div>
            <h3>Division Progress Detail</h3>
            
            {divisions.map(div => {
              const divData = data.divisions[div];
              const percentage = divData.total > 0 ? (divData.completed / divData.total * 100) : 0;
              
              let divLabel;
              switch(div) {
                case 'U_SPORTS':
                  divLabel = 'U Sports (Canada Universities)';
                  break;
                case 'CCAA':
                  divLabel = 'CCAA (Canada Colleges)';
                  break;
                default:
                  divLabel = `NCAA ${div}`;
              }
              
              return (
                <div key={div} style={{
                  margin: '20px 0',
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  borderLeft: '4px solid #0d9488'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>{divLabel}</strong>
                    <span>{divData.completed}/{divData.total} ({divData.coaches.toLocaleString()} coaches)</span>
                  </div>
                  <div style={{
                    background: '#e5e5e5',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    height: '20px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #0d9488, #14b8a6)',
                      height: '100%',
                      width: `${percentage}%`,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Last Updated */}
          <div style={{
            textAlign: 'center',
            color: '#666',
            fontStyle: 'italic',
            marginTop: '20px'
          }}>
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
}