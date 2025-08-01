import { useState } from 'react';
import Head from 'next/head';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [diseaseData] = useState({
    'Healthy': 45,
    'Leaf Spot': 18,
    'Bud Rot': 12,
    'Lethal Yellowing': 8,
    'CCI Caterpillars': 6,
    'WCLWD': 11
  });

  const totalScans = Object.values(diseaseData).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count) => ((count / totalScans) * 100).toFixed(1);

  const getDiseaseIcon = (disease) => {
    const icons = {
      'Healthy': '✅',
      'Leaf Spot': '🟤',
      'Bud Rot': '🔴',
      'Lethal Yellowing': '🟡',
      'CCI Caterpillars': '🐛',
      'WCLWD': '🟠'
    };
    return icons[disease] || '🔬';
  };

  const getDiseaseColor = (disease) => {
    const colors = {
      'Healthy': '#4CAF50',
      'Leaf Spot': '#8D6E63',
      'Bud Rot': '#F44336',
      'Lethal Yellowing': '#FFC107',
      'CCI Caterpillars': '#9C27B0',
      'WCLWD': '#FF5722'
    };
    return colors[disease] || '#757575';
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Head>
        <title>📊 Analytics - Coconut Disease Dashboard</title>
        <meta name="description" content="Analytics and insights for coconut disease detection" />
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
        <h1 style={{ margin: 0, fontSize: '2.5em' }}>📊 Disease Analytics</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.2em' }}>Comprehensive Health Insights</p>
      </div>

      {/* Time Range Selector */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2E7D32' }}>📅 Time Range</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: timeRange === range ? '#2E7D32' : '#e0e0e0',
                color: timeRange === range ? 'white' : '#666',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {range === '7d' && 'Last 7 Days'}
              {range === '30d' && 'Last Month'}
              {range === '90d' && 'Last 3 Months'}
              {range === '1y' && 'Last Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Distribution */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#2E7D32' }}>🔬 Disease Distribution</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {/* Chart Area */}
          <div>
            <h3 style={{ color: '#666', marginBottom: '20px' }}>Disease Breakdown</h3>
            <div style={{ position: 'relative' }}>
              {Object.entries(diseaseData).map(([disease, count], index) => {
                const percentage = getPercentage(count);
                return (
                  <div key={disease} style={{ 
                    marginBottom: '15px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '10px',
                    border: `3px solid ${getDiseaseColor(disease)}`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>
                        {getDiseaseIcon(disease)} {disease}
                      </span>
                      <span style={{ fontWeight: 'bold', color: getDiseaseColor(disease) }}>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%',
                        backgroundColor: getDiseaseColor(disease),
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div>
            <h3 style={{ color: '#666', marginBottom: '20px' }}>Key Metrics</h3>
            
            <div style={{ 
              padding: '20px',
              backgroundColor: '#e8f5e8',
              borderRadius: '10px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>✅</div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#4CAF50' }}>
                {getPercentage(diseaseData['Healthy'])}%
              </div>
              <div style={{ color: '#666' }}>Healthy Trees</div>
            </div>

            <div style={{ 
              padding: '20px',
              backgroundColor: '#fff3e0',
              borderRadius: '10px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🦠</div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#FF9800' }}>
                {getPercentage(totalScans - diseaseData['Healthy'])}%
              </div>
              <div style={{ color: '#666' }}>Disease Detected</div>
            </div>

            <div style={{ 
              padding: '20px',
              backgroundColor: '#ffebee',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🚨</div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#F44336' }}>
                {getPercentage(diseaseData['Bud Rot'] + diseaseData['Lethal Yellowing'])}%
              </div>
              <div style={{ color: '#666' }}>Critical Diseases</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#2E7D32' }}>📈 Trend Analysis</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ 
            padding: '20px',
            backgroundColor: '#f0f8f0',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>📊</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2E7D32' }}>↑ 12%</div>
            <div style={{ color: '#666' }}>Detection Rate vs Last Period</div>
          </div>

          <div style={{ 
            padding: '20px',
            backgroundColor: '#f3e5f5',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>🎯</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#9C27B0' }}>94.2%</div>
            <div style={{ color: '#666' }}>Average Confidence Score</div>
          </div>

          <div style={{ 
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2196F3' }}>1.8s</div>
            <div style={{ color: '#666' }}>Average Processing Time</div>
          </div>

          <div style={{ 
            padding: '20px',
            backgroundColor: '#fff8e1',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>📱</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#FF9800' }}>{totalScans}</div>
            <div style={{ color: '#666' }}>Total Scans This Period</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#2E7D32' }}>💡 AI Recommendations</h2>
        
        <div style={{ 
          display: 'grid', 
          gap: '15px'
        }}>
          <div style={{ 
            padding: '20px',
            backgroundColor: '#fff3e0',
            borderRadius: '10px',
            borderLeft: '5px solid #FF9800'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              ⚠️ High Disease Activity Detected
            </div>
            <div style={{ color: '#666' }}>
              Leaf Spot cases increased by 23% this week. Consider implementing preventive fungicide treatments in affected areas.
            </div>
          </div>

          <div style={{ 
            padding: '20px',
            backgroundColor: '#e8f5e8',
            borderRadius: '10px',
            borderLeft: '5px solid #4CAF50'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              ✅ Good Overall Health
            </div>
            <div style={{ color: '#666' }}>
              45% of scanned trees are healthy. Continue current maintenance practices for optimal results.
            </div>
          </div>

          <div style={{ 
            padding: '20px',
            backgroundColor: '#ffebee',
            borderRadius: '10px',
            borderLeft: '5px solid #F44336'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              🚨 Critical Cases Require Attention
            </div>
            <div style={{ color: '#666' }}>
              20 trees with Bud Rot or Lethal Yellowing need immediate intervention to prevent spread.
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px'
      }}>
        <button style={{
          backgroundColor: '#2E7D32',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1.1em',
          fontWeight: 'bold',
          marginRight: '15px'
        }}>
          🏠 Back to Dashboard
        </button>
        <button style={{
          backgroundColor: '#FF6F00',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1.1em',
          fontWeight: 'bold'
        }}>
          📤 Export Report
        </button>
      </div>
    </div>
  );
}
