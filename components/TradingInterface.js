import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ChevronDown, ArrowUpDown, Copy, Settings, HelpCircle, Menu } from 'lucide-react';
import styles from './TradingInterface.module.css';

const TradingInterface = () => {
  const { login, logout, ready, authenticated, user } = usePrivy();
  
  const [payToken, setPayToken] = useState({ symbol: 'USDC', name: 'USD Coin', icon: '💲' });
  const [receiveToken, setReceiveToken] = useState({ symbol: 'WBTC', name: 'Wrapped BTC', icon: '₿' });
  const [payAmount, setPayAmount] = useState('1000');
  const [receiveAmount, setReceiveAmount] = useState('0.00844425');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [expiryTime, setExpiryTime] = useState('7 Days');
  const [alertName, setAlertName] = useState('');
  const [alertMessage, setAlertMessage] = useState('Yeti limit order triggered');
  const [webhookUrl, setWebhookUrl] = useState('https://api.yeti.trade/webhook/alert');
  
  // Dropdown states
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showPayTokenDropdown, setShowPayTokenDropdown] = useState(false);
  const [showReceiveTokenDropdown, setShowReceiveTokenDropdown] = useState(false);
  const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);

  const chains = ['Ethereum', 'Arbitrum', 'Polygon', 'Optimism'];
  const expiryOptions = ['5 minutes', '15 minutes', '1 hour', '4 hours', '1 day', '7 days', '30 days'];
  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', icon: '💲' },
    { symbol: 'WBTC', name: 'Wrapped BTC', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: '🔷' },
    { symbol: 'USDT', name: 'Tether USD', icon: '💚' }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const swapTokens = () => {
    const tempToken = payToken;
    const tempAmount = payAmount;
    setPayToken(receiveToken);
    setReceiveToken(tempToken);
    setPayAmount(receiveAmount);
    setReceiveAmount(tempAmount);
  };

  const setMaxAmount = () => {
    setPayAmount('1000'); // Mock max balance
  };

  const setHalfAmount = () => {
    setPayAmount('500'); // Mock 50% of balance
  };

  return (
    <div className={styles.tradingInterface}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>Yeti</h1>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.dropdownContainer}>
            <div 
              className={styles.chainSelector}
              onClick={() => setShowChainDropdown(!showChainDropdown)}
            >
              <div className={styles.chainIcon}>🔷</div>
              <span>{selectedChain}</span>
              <ChevronDown size={16} />
            </div>
            {showChainDropdown && (
              <div className={styles.dropdownMenu}>
                {chains.map(chain => (
                  <div 
                    key={chain}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedChain(chain);
                      setShowChainDropdown(false);
                    }}
                  >
                    <span>🔷</span>
                    {chain}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {ready && !authenticated ? (
            <button className={styles.connectWalletBtn} onClick={login}>
              Connect wallet
            </button>
          ) : (
            <button className={`${styles.connectWalletBtn} ${styles.connected}`} onClick={logout}>
              {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
            </button>
          )}
          
          <HelpCircle size={20} className={styles.iconBtn} />
          <Settings size={20} className={styles.iconBtn} />
          <Menu size={20} className={styles.iconBtn} />
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.tradingCard}>
          {/* Tab Header */}
          <div className={styles.tabHeader}>
            <button className={`${styles.tab} ${styles.inactive}`}>Swap</button>
            <button className={`${styles.tab} ${styles.active}`}>Limit</button>
            <div className={styles.tabIndicator}></div>
          </div>

          {/* Token Selection */}
          <div className={styles.tokenSection}>
            <div className={styles.tokenInputGroup}>
              <div className={styles.tokenLabel}>You pay</div>
              <div className={styles.tokenInput}>
                <div className={styles.dropdownContainer}>
                  <div 
                    className={styles.tokenSelector}
                    onClick={() => setShowPayTokenDropdown(!showPayTokenDropdown)}
                  >
                    <span className={styles.tokenIcon}>{payToken.icon}</span>
                    <span className={styles.tokenSymbol}>{payToken.symbol}</span>
                    <ChevronDown size={16} />
                  </div>
                  {showPayTokenDropdown && (
                    <div className={`${styles.dropdownMenu} ${styles.tokenDropdown}`}>
                      {tokens.map(token => (
                        <div 
                          key={token.symbol}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setPayToken(token);
                            setShowPayTokenDropdown(false);
                          }}
                        >
                          <span className={styles.tokenIcon}>{token.icon}</span>
                          <div>
                            <div className={styles.tokenSymbol}>{token.symbol}</div>
                            <div className={styles.tokenNameSmall}>{token.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  value={payAmount} 
                  onChange={(e) => setPayAmount(e.target.value)}
                  className={styles.amountInput}
                />
              </div>
              <div className={styles.amountButtons}>
                <button className={styles.amountBtn} onClick={setHalfAmount}>50%</button>
                <button className={styles.amountBtn} onClick={setMaxAmount}>Max</button>
              </div>
              <div className={styles.tokenName}>{payToken.name}</div>
              <div className={styles.tokenValue}>~$1,002.19</div>
            </div>

            <button className={styles.swapButton} onClick={swapTokens}>
              <ArrowUpDown size={16} />
            </button>

            <div className={styles.tokenInputGroup}>
              <div className={styles.tokenLabel}>You receive</div>
              <div className={styles.balance}>Balance: 0</div>
              <div className={styles.tokenInput}>
                <div className={styles.dropdownContainer}>
                  <div 
                    className={styles.tokenSelector}
                    onClick={() => setShowReceiveTokenDropdown(!showReceiveTokenDropdown)}
                  >
                    <span className={styles.tokenIcon}>{receiveToken.icon}</span>
                    <span className={styles.tokenSymbol}>{receiveToken.symbol}</span>
                    <ChevronDown size={16} />
                  </div>
                  {showReceiveTokenDropdown && (
                    <div className={`${styles.dropdownMenu} ${styles.tokenDropdown}`}>
                      {tokens.map(token => (
                        <div 
                          key={token.symbol}
                          className={styles.dropdownItem}
                          onClick={() => {
                            setReceiveToken(token);
                            setShowReceiveTokenDropdown(false);
                          }}
                        >
                          <span className={styles.tokenIcon}>{token.icon}</span>
                          <div>
                            <div className={styles.tokenSymbol}>{token.symbol}</div>
                            <div className={styles.tokenNameSmall}>{token.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  value={receiveAmount} 
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  className={styles.amountInput}
                />
              </div>
              <div className={styles.tokenName}>{receiveToken.name}</div>
              <div className={styles.tokenValue}>~$999.33 (-0.29%)</div>
            </div>
          </div>

          {/* Order Details */}
          <div className={styles.orderDetails}>
            <div className={styles.orderDetailItem}>
              <span>Pay {payToken.symbol} at rate (-0.29%)</span>
              <span>0.000008442543434</span>
            </div>
            <div className={styles.orderDetailItem}>
              <span className={styles.marketToggle}>Set to market 🔒</span>
              <span>{receiveToken.symbol} ↻</span>
            </div>
            <div className={styles.orderDetailItem}>
              <span>Expires in ⓘ</span>
              <div className={styles.dropdownContainer}>
                <div 
                  className={styles.expirySelector}
                  onClick={() => setShowExpiryDropdown(!showExpiryDropdown)}
                >
                  <span>{expiryTime}</span>
                  <ChevronDown size={16} />
                </div>
                {showExpiryDropdown && (
                  <div className={`${styles.dropdownMenu} ${styles.expiryDropdown}`}>
                    {expiryOptions.map(option => (
                      <div 
                        key={option}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setExpiryTime(option);
                          setShowExpiryDropdown(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TradingView Alert Section */}
          <div className={styles.alertSection}>
            <h3>Set up TradingView Alert</h3>
            
            <div className={styles.inputGroup}>
              <label>Alert Name</label>
              <input 
                type="text" 
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                placeholder="Enter alert name"
                className={styles.alertInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Alert Message</label>
              <div className={styles.inputWithCopy}>
                <input 
                  type="text" 
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className={styles.alertInput}
                />
                <button 
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(alertMessage)}
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Webhook URL</label>
              <div className={styles.inputWithCopy}>
                <input 
                  type="text" 
                  value={webhookUrl}
                  readOnly
                  className={`${styles.alertInput} ${styles.readonly}`}
                />
                <button 
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(webhookUrl)}
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Connect Wallet Button */}
          {!authenticated ? (
            <button className={styles.mainConnectBtn} onClick={login}>
              Connect wallet
            </button>
          ) : (
            <button className={styles.mainConnectBtn}>
              Place Limit Order
            </button>
          )}
        </div>

        {/* Price Info */}
        <div className={styles.priceInfo}>
          <span>{receiveToken.symbol} price</span>
          <ChevronDown size={16} />
          <span className={styles.price}>118423 {payToken.symbol} ~$118,682,485</span>
        </div>
      </main>
    </div>
  );
};

export default TradingInterface;