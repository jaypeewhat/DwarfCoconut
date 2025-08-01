import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    diseased: 0,
    critical: 0
  });

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await fetch('/api/scans');
      const data = await response.json();
      setScans(data);
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scans:', error);
      setLoading(false);
    }
  };

  const calculateStats = (scanData) => {
    const total = scanData.length;
    const healthy = scanData.filter(s => 
      s.disease_detected.toLowerCase().includes('healthy')
    ).length;
    const critical = scanData.filter(s => 
      s.severity_level.includes('Critical') || s.severity_level.includes('🔴')
    ).length;
    const diseased = total - healthy;

    setStats({ total, healthy, diseased, critical });
  };

  const getSeverityColor = (severity) => {
    if (severity.includes('🟢')) return '#4CAF50';
    if (severity.includes('🟡')) return '#FF9800';
    if (severity.includes('🟠')) return '#FF5722';
    if (severity.includes('🔴')) return '#F44336';
    return '#757575';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>🌴 Loading Coconut Disease Dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Head>
        <title>🥥 Coconut Disease Dashboard</title>
        <meta name="description" content="Monitor coconut tree health with AI-powered disease detection" />
      </Head>

      {/* Header */}
      <div style={{ 
        backgroundColor: '#2E7D32', 
        color: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5em' }}>🥥 Coconut Disease Dashboard</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.2em' }}>AI-Powered Coconut Tree Health Monitoring</p>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>📊</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#2E7D32' }}>{stats.total}</div>
          <div style={{ color: '#666' }}>Total Scans</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#4CAF50' }}>{stats.healthy}</div>
          <div style={{ color: '#666' }}>Healthy Trees</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🦠</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FF9800' }}>{stats.diseased}</div>
          <div style={{ color: '#666' }}>Diseased Trees</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🚨</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#F44336' }}>{stats.critical}</div>
          <div style={{ color: '#666' }}>Critical Cases</div>
        </div>
      </div>

      {/* Scans List */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#2E7D32' }}>🔬 Recent Scans</h2>
        
        {scans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            📱 No scans yet. Use the mobile app to start detecting diseases!
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '20px'
          }}>
            {scans.map((scan, index) => (
              <div key={scan.id} style={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  {/* Image */}
                  <div style={{ width: '100px', height: '100px' }}>
                    {scan.image_url ? (
                      <img 
                        src={scan.image_url} 
                        alt="Coconut scan"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        backgroundColor: '#e0e0e0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2em'
                      }}>
                        🥥
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{ 
                      fontSize: '1.3em', 
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      {scan.disease_detected.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div style={{ color: '#666', marginBottom: '5px' }}>
                      📅 {new Date(scan.timestamp).toLocaleString()}
                    </div>
                    <div style={{ color: '#666', marginBottom: '5px' }}>
                      🎯 Confidence: {Math.round(scan.confidence * 100)}%
                    </div>
                    <div style={{ 
                      color: getSeverityColor(scan.severity_level),
                      fontWeight: 'bold'
                    }}>
                      {scan.severity_level}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ textAlign: 'right' }}>
                    <button style={{
                      backgroundColor: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '10px',
                      display: 'block',
                      width: '100%'
                    }}>
                      📋 View Details
                    </button>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      Scan #{index + 1}
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                {scan.recommendation && (
                  <div style={{ 
                    marginTop: '15px',
                    padding: '15px',
                    backgroundColor: '#e8f5e8',
                    borderRadius: '8px',
                    borderLeft: '4px solid #4CAF50'
                  }}>
                    <strong>💡 Recommendation:</strong> {scan.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px',
        color: '#666',
        fontSize: '0.9em'
      }}>
        <p>🌱 Powered by AI • Helping farmers protect coconut trees worldwide</p>
        <p>📱 Download the mobile app to start scanning</p>
      </div>
    </div>
  );
}
